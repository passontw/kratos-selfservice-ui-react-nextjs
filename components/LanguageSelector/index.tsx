import * as React from 'react';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { useRouter } from 'next/router';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useLocalStorage } from '../../util/useLocalStorage';

const theme = createTheme({
    components: {
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: '#37374F',
            borderRadius: '12px',
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: '#FFFFFF',
          },
        },
      },
    },
  });

export default function MenuPopupState() {
    const router = useRouter();
    const [value, setValue] = useLocalStorage('lang', '');
    const menuItems = [
        { label: 'English', locale: 'en' },
        { label: '繁體中文', locale: 'zh-Hant' },
        // ...add more languages here
    ];

    useEffect(() => {
        setValue(value);
        router.push(router.pathname, router.pathname, { locale: value });
    }, []);

    // Find the language label that matches the language code stored in local storage
    const initialLangLabel = menuItems.find((item) => item.locale === value)?.label || menuItems[0].label;

    const [buttonText, setButtonText] = useState(initialLangLabel); // Set initial value based on local storage

    return (
        <ThemeProvider theme={theme}>
            <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
                <React.Fragment>
                    <Button 
                        {...bindTrigger(popupState)}
                        style={{
                            width: '150px',
                            height: '44px',
                            borderRadius: '8px',
                            padding: '12px 20px',
                            color: '#C0C0C0',
                            border: '1px solid #C0C0C0',
                            backgroundColor: '#32323D',
                            fontSize: '14px',
                        }}
                    >
                        {buttonText}
                    </Button>
                    <Menu
                        {...bindMenu(popupState)}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        MenuListProps={{ style: { backgroundColor: '#37374F' } }}
                        sx={{ 
                            "& .MuiPaper-root": { borderRadius: '12px', marginTop: '-10px' },
                            "& .MuiPopover-paper": { borderRadius: '12px' }
                        }}>
                        {menuItems.map((item) => (
                            <MenuItem
                                key={item.locale}
                                style={{ minWidth: '166px' }}
                                onClick={() => {
                                    setButtonText(item.label);
                                    setValue(item.locale);
                                    popupState.close();
                                    router.push(router.pathname, router.pathname, { locale: item.locale });
                                }}
                            >
                                {item.label}
                            </MenuItem>
                        ))}
                    </Menu>
                </React.Fragment>
            )}
            </PopupState>
        </ThemeProvider>
    );
}
