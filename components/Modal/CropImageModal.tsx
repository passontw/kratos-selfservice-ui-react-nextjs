import Box from "@mui/material/Box"
// import CanvasCapture from 'canvas-capture'; // global import may cause high cpu usage in dev environment
import { parseGIF, decompressFrames, ParsedFrame } from "gifuct-js"
import { useEffect, useMemo, useRef, useState } from "react"
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop"
// import "react-image-crop/src/ReactCrop.scss"
import { useDispatch } from "react-redux"

import ory from "../../pkg/sdk"
import useDebounceEffect from "../../util/useDebounceEffect"

import ButtonAction from "./ButtonAction"
import Modal from "./Modal"
import {
  StyledBoxContent,
  StyledBoxFooter,
  StyledCropImageContainer,
  StyledCropImageFiller,
  StyledCropImageWrapper,
} from "./styles"

export const SECOND_GREY = "#C2C2C2"
export const BLACK = "#000000"
export const DARKER_BLACK = "#222223"
export const DEEP_BLACK = "#121212"

interface CropImageModalProps {
  children?: React.ReactNode
  open: boolean
  handleClose: () => void
  mode?: string
  imageSrc: string
  aspect?: number
  radius?: string
  minWidth?: number
  maxWidth?: number
}

type IAxis = "vertical" | "horizontal"

let canvasCaptureAnimationFrameEvent: number
let cropTimeoutEvent: NodeJS.Timeout

let gifCapture: any // CanvasCapture.ACTIVE_CAPTURE | undefined;

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
  percentage: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: percentage,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

const canvasPreview = ({
  image,
  canvas,
  crop,
  axis,
  baseTranslation,
  gifFrames,
}: {
  image: HTMLImageElement
  canvas: HTMLCanvasElement
  crop: PixelCrop
  axis: IAxis
  baseTranslation: number
  gifFrames: ParsedFrame[]
}) => {
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    throw new Error("No 2d context")
  }

  canvas.width = crop.width
  canvas.height = crop.height

  ctx.imageSmoothingQuality = "low"

  const cropX = crop.x
  const cropY = crop.y

  ctx.save()
  ctx.translate(-cropX, -cropY)
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    axis === "vertical" ? baseTranslation : 0,
    axis === "horizontal" ? baseTranslation : 0,
    image.width,
    image.height,
  )

  // GIF START -------------------
  let activeFrame = 0

  if (cropTimeoutEvent) {
    clearTimeout(cropTimeoutEvent)
  }
  if (gifFrames.length > 0) {
    const tempCanvas = document.createElement("canvas")
    const tempCtx = tempCanvas.getContext("2d")

    if (!tempCtx) {
      throw new Error("No temp 2d context")
    }

    tempCtx.imageSmoothingQuality = "low"
    let frameImageData: ImageData
    const frameScale = image.width / gifFrames[0].dims.width

    const anim = () => {
      if (cropTimeoutEvent) {
        clearTimeout(cropTimeoutEvent)
      }

      const { dims, delay } = gifFrames[activeFrame]
      tempCanvas.width = dims.width
      tempCanvas.height = dims.height

      frameImageData = ctx.createImageData(dims.width, dims.height)
      frameImageData.data.set(gifFrames[activeFrame].patch)
      tempCtx.putImageData(frameImageData, 0, 0)

      ctx.drawImage(
        tempCanvas,
        0,
        0,
        tempCanvas.width,
        tempCanvas.height,
        axis === "vertical"
          ? baseTranslation + dims.left * frameScale - cropX
          : dims.left * frameScale - cropX,
        axis === "horizontal"
          ? baseTranslation + dims.top * frameScale - cropY
          : dims.top * frameScale - cropY,
        dims.width * frameScale,
        dims.height * frameScale,
      )

      activeFrame += 1
      if (activeFrame >= gifFrames.length) {
        activeFrame = 0
      }
      cropTimeoutEvent = setTimeout(() => {
        anim()
      }, delay)
    }
    anim()
  }
  // GIF END -------------------

  // fill black rect around
  ctx.fillStyle = BLACK
  if (axis === "vertical") {
    ctx.fillRect(0, 0, baseTranslation, image.height)
    ctx.fillRect(
      image.width + baseTranslation,
      0,
      baseTranslation,
      image.height,
    )
  } else if (axis === "horizontal") {
    ctx.fillRect(0, 0, image.width, baseTranslation)
    ctx.fillRect(
      0,
      image.height + baseTranslation,
      image.width,
      baseTranslation,
    )
  }

  ctx.restore()
}

const blobToBase64 = async (blob: Blob) => {
  const reader = new FileReader()
  reader.readAsDataURL(blob)
  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result)
    }
  })
}

const CropImageModal: React.FC<CropImageModalProps> = ({
  open,
  handleClose,
  imageSrc,
  aspect = 1 / 1,
  radius = "0",
  minWidth,
  maxWidth,
}) => {
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const axis = useMemo<IAxis>(() => {
    if (!imgRef?.current) return "vertical"
    const { naturalWidth, naturalHeight } = imgRef.current
    const imgAspect = naturalWidth / naturalHeight
    return aspect > imgAspect ? "vertical" : "horizontal"
  }, [imgRef?.current?.src])
  const baseTranslation = useMemo(() => {
    if (!imgRef?.current) return 0
    const { width, height } = imgRef.current
    if (axis === "horizontal") {
      const wrapperHeight = width / aspect
      return (wrapperHeight - height) / 2
    }
    const wrapperWidth = height * aspect
    return (wrapperWidth - width) / 2
  }, [imgRef?.current?.src, axis])
  const hiddenAnchorRef = useRef<HTMLAnchorElement>(null)
  const blobUrlRef = useRef("")
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [gifFrames, setGifFrames] = useState<ParsedFrame[]>([])
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const initCrop = ({ width, height }: { width: number; height: number }) => {
    const imgAspect = width / height
    const percentage =
      (aspect > imgAspect ? width / height : height / width) * 100
    setCrop(centerAspectCrop(width, width / aspect, aspect, percentage))
  }

  const onImageLoad = async (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (aspect) {
      const { width, height } = e.currentTarget
      fetch(e.currentTarget.src)
        .then((resp) => resp.arrayBuffer())
        .then((buff) => {
          const gif = parseGIF(buff)
          const frames = decompressFrames(gif, true)
          setGifFrames(frames)
          initCrop({ width, height })
        })
    }
  }

  const initCapture = async ({ canvas }: { canvas: HTMLCanvasElement }) => {
    const CanvasCapture = (await import("canvas-capture")).default
    CanvasCapture.init(canvas)

    const loop = () => {
      canvasCaptureAnimationFrameEvent = requestAnimationFrame(loop)
      if (CanvasCapture.isRecording()) CanvasCapture.recordFrame()
    }
    loop()
  }

  useEffect(() => {
    if (!previewCanvasRef.current) return
    initCapture({ canvas: previewCanvasRef.current })
  }, [previewCanvasRef.current])

  const [user, setUser] = useState<{
    email: string
    location: string
    name: string
    loginVerification: boolean
    source: string
  } | null>(null)

  useEffect(() => {
    ory.toSession().then(({ data }) => {
      console.log("@data", data)
      setUser(data?.identity?.traits || {})
    })
  }, [])

  const handleBase64ImageUpload = (base64: string, extension: string) => {
    // DeviceProvider.uploadDisplayImageBase64(base64, extension);
    setIsProcessing(false)
  }

  const handleCaptureCrop = async () => {
    if (isProcessing) return
    if (!previewCanvasRef.current) {
      throw new Error("Crop canvas does not exist")
    }
    setIsProcessing(true)
    // is animated gif
    if (gifFrames.length > 0) {
      const CanvasCapture = (await import("canvas-capture")).default
      const sum = gifFrames.reduce((accumulator, item) => {
        return accumulator + item.delay
      }, 0)

      // ensure all gif frames patched
      setTimeout(() => {
        gifCapture = CanvasCapture.beginGIFRecord({
          name: "demo-gif",
          quality: 1,
          fps: 60,
          onExport: async (blob: Blob) => {
            const data = (await blobToBase64(blob)) as string
            if (data) handleBase64ImageUpload(data.split(";base64,")[1], "gif")
            handleClose()
            // export blob and download
            // handleSaveCapture(blob) // to download
          },
        })

        setTimeout(() => {
          CanvasCapture.stopRecord(gifCapture)
          gifCapture = undefined
        }, sum)
      }, sum)

      return
    }

    const baseData = previewCanvasRef.current.toDataURL()
    console.log("baseData", baseData)

    if (!user) return
    console.log("user", user)
    const response = await fetch("/api/image/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: user.name,
        email: user.email,
        file: baseData,
      }),
    })
    console.log("response", response)
    handleBase64ImageUpload(baseData.split(";base64,")[1], "png")
    handleClose()

    // export blob and download
    // previewCanvasRef.current.toBlob( async (blob) => {
    //   if (!blob) {
    //     throw new Error('Failed to create blob');
    //   }
    //   handleSaveCapture(blob);// to download
    // });
  }

  // const handleSaveCapture = (blob: Blob) => {
  //   if (blobUrlRef.current) {
  //     URL.revokeObjectURL(blobUrlRef.current);
  //   }
  //   blobUrlRef.current = URL.createObjectURL(blob);

  //   // for save image to local
  //   hiddenAnchorRef.current!.href = blobUrlRef.current;
  //   hiddenAnchorRef.current!.click();
  //   // for uploading image
  //   // const newImage = new File(
  //   //   [blob],
  //   //   `croppedfilename-${Math.random().toString().substring(2)}`,
  //   //   { type: blob.type }
  //   // );
  //   // const formData = new FormData();
  //   // formData.append('file', newImage);

  //   setIsProcessing(false);
  // };

  const dispatch = useDispatch()
  const handleResetCrop = async () => {
    if (!imgRef.current) return
    await setCrop(undefined)
    await initCrop({
      width: imgRef.current.width,
      height: imgRef.current.height,
    })
  }

  const handleOpenResetCropDialog = () => {
    // dispatch(
    //   setDialog({
    //     title: 'Reset to default settings?',
    //     titleHeight: '6rem',
    //     width: 440,
    //     height: 140,
    //     center: true,
    //     children: <ResetCrop confirmEvent={handleResetCrop} />,
    //   })
    // );
    // dispatch(
    //   setInfoDialog({
    //     type: 'confirm',
    //     content: 'reset',
    //     handleAfterSubmit: () => {
    //       handleResetCrop();
    //     },
    //   })
    // );
    handleResetCrop()
  }

  useDebounceEffect(
    async () => {
      if (!open) return
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview({
          image: imgRef.current,
          canvas: previewCanvasRef.current,
          crop: completedCrop,
          axis,
          baseTranslation,
          gifFrames,
        })
      }
    },
    100,
    [completedCrop, open, axis, baseTranslation, gifFrames],
  )

  useEffect(() => {
    if (!open) {
      setCrop(undefined)
      setCompletedCrop(undefined)
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
      }
      clearTimeout(cropTimeoutEvent)
      cancelAnimationFrame(canvasCaptureAnimationFrameEvent)
    }
  }, [open])

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
      }
      clearTimeout(cropTimeoutEvent)
      cancelAnimationFrame(canvasCaptureAnimationFrameEvent)
    }
  }, [])

  // console.log(imageSrc);

  return (
    <Modal
      open={open}
      handleClose={(e?: any, reason?: string) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") return
        handleClose()
      }}
      title={"Crop Image"}
      wrapperStyles={{
        width: maxWidth ? Math.min(1000, maxWidth + 80) : 1000, // 80: modal padding
      }}
      headerStyles={{ backgroundColor: DEEP_BLACK }}
    >
      <StyledBoxContent
        sx={{
          paddingTop: "20px",
          paddingBottom: "20px",
          background: DARKER_BLACK,
        }}
      >
        <StyledCropImageWrapper radius={radius}>
          {!!imageSrc && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => {
                if (percentCrop.width === 0 || percentCrop.height === 0) return
                setCrop(percentCrop)
              }}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              minWidth={minWidth}
              maxWidth={maxWidth}
              disabled={isProcessing}
            >
              <StyledCropImageContainer aspect={aspect} axis={axis}>
                <StyledCropImageFiller />
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imageSrc}
                  onLoad={onImageLoad}
                />
                <StyledCropImageFiller />
              </StyledCropImageContainer>
            </ReactCrop>
          )}
        </StyledCropImageWrapper>

        {completedCrop && (
          // toggle display property for testing crop boundaries
          <Box display="none">
            <canvas ref={previewCanvasRef} />
            <a ref={hiddenAnchorRef} download style={{ display: "none" }} />
          </Box>
        )}
      </StyledBoxContent>

      <StyledBoxFooter>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Box>
            <ButtonAction
              text="Reset"
              background={DARKER_BLACK}
              onClick={handleOpenResetCropDialog}
              sx={{
                border: `1px solid ${SECOND_GREY}`,
                color: SECOND_GREY,
                "&:hover": {
                  border: `1px solid transparent`,
                },
              }}
            />
          </Box>
          <Box display="flex" gap="16px">
            <ButtonAction
              text="Cancel"
              background={DARKER_BLACK}
              sx={{
                border: `1px solid ${SECOND_GREY}`,
                color: SECOND_GREY,
                "&:hover": {
                  border: `1px solid transparent`,
                },
              }}
              onClick={handleClose}
            />
            <ButtonAction
              text="Save"
              onClick={handleCaptureCrop}
              disable={isProcessing}
            />
          </Box>
        </Box>
      </StyledBoxFooter>
    </Modal>
  )
}

export default CropImageModal
