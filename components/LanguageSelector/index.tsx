import * as React from 'react';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { useRouter } from 'next/router';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useLocalStorage } from '../../util/useLocalStorage';
import Box from '@mui/material/Box';
import Dropdown from '../../public/images/Dropdown';

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
            '&:hover': {
              backgroundColor: '#272735',
            },
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
        { label: '簡體中文', locale: 'zh-Hans' },
        { label: '日本語', locale: 'ja' },
        { label: '한국어', locale: 'ko' },
        { label: 'ภาษาไทย', locale: 'th' },
        { label: 'Tiếng Việt', locale: 'vi' },
        { label: 'Indonesia', locale: 'id' },
        { label: 'Español', locale: 'es' },
        { label: 'Français', locale: 'fr' },
        { label: 'Deutsch', locale: 'de' },
        { label: 'Nederlands', locale: 'nl' },
        { label: 'Русский', locale: 'ru' },
        { label: 'Italian', locale: 'it' },
        { label: 'Türkçe', locale: 'tr' },
        { label: 'Polski', locale: 'pl' },
        { label: 'Português (BR)', locale: 'pt_BR' },
        // ...add more languages here
    ];

    useEffect(() => {
        const conditions = ["/login", "/registration", "/settings", "/profile", "/account"];
        if (conditions.includes(router.pathname)) {
          setValue(value);
          router.push(router.pathname, router.pathname, { locale: value });
        }  
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
                        sx={{
                          width: '150px',
                          height: '44px',
                          borderRadius: '8px',
                          padding: '12px 20px',
                          color: '#C0C0C0',
                          border: '1px solid #C0C0C0',
                          backgroundColor: '#1F1F2A',
                          fontSize: '13px',
                          '@media (max-width: 600px)': {
                            width: '80vw',
                          },
                        }}
                    >
                        <Box display="flex" width="100%" position="relative">
                          <Box>{buttonText}</Box>
                          <Box position="absolute" right="0px">
                            <Dropdown color="#C0C0C0" /></Box>
                        </Box>
                    </Button>
                    <Menu
                        {...bindMenu(popupState)}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        MenuListProps={{
                          style: { backgroundColor: '#37374F' },
                          sx: {
                            width: '150px',
                            '@media (max-width: 600px)': {
                              width: '80vw',
                            },
                          },
                        }}
                        sx={{ 
                            "& .MuiPaper-root": { borderRadius: '12px', marginTop: '-10px' },
                            "& .MuiPopover-paper": { borderRadius: '12px' },
                            "& .MuiMenu-list": { 
                              maxHeight: '200px',
                              overflowY: 'scroll',
                              overflowX: 'hidden',
                              '&::-webkit-scrollbar': {
                                width: '5px',
                                height: '5px',
                              },
                              '&::-webkit-scrollbar-track': {
                                borderRadius: '4px',
                                backgroundColor: '#37374F',
                              },
                              '&::-webkit-scrollbar-thumb': {
                                background: '#A62BC3',
                                borderRadius: '4px',
                              },
                             },
                        }}>
                        {menuItems.map((item) => (
                            <MenuItem
                                key={item.locale}
                                sx={{
                                  width: '100%',
                                  fontSize: '14px',
                                  '@media (max-width: 600px)': {
                                    width: '80vw',
                                  },
                                }}
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
