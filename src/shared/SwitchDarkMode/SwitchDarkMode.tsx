import React, { useEffect, useState } from "react";
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import { Box, Button, Chip, Divider, Drawer, Grid, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'; import { ArrowForward } from "@material-ui/icons";
import { AddPhotoAlternate, ArrowForwardIos, CheckBox, CheckBoxOutlineBlank, CheckBoxOutlineBlankOutlined, ColorizeSharp, RestartAlt } from "@mui/icons-material";
import { ChromePicker } from "react-color";
import { useCookies, CookiesProvider } from "react-cookie";
import rgbHex from "rgb-hex";
import hslHex from 'hsl-to-hex';
import Wallpaper from "../../data/wallpapers.json";



const DRAWER_STYLE = {
  width: "250px",
  height: "100vh",
  borderLeft: "1px solid gray",
  backgroundColor: '#13131d',
  color: '#6b7280',
  "& .MuiSvgIcon-root": {
    color: '#6b7280',
    width: "24px",
    height: "24px",
  },
  "& span": {
    fontSize: "16px",
  },
};




// export interface SwitchDarkModeProps {
//   className?: string;
// }
// const SwitchDarkMode: React.FC<SwitchDarkModeProps> = ({ className = "" }) => {
const SwitchDarkMode = () => {
  const [cookies, setCookie] = useCookies(["updateThemeFlag"]);

  const [viewSettingDrawer, setViewSettingDrawer] = useState(false);
  const [viewColorSetDrawer, setViewColorSetDrawer] = useState(false);

  const [newTheme, setNewTheme] = useState({
    backgroundColor: "#ffffffff",
    backgroundImage: "",
    blurMode: false,
  });
  const [updateValue, setUpdateValue] = useState(false);

  const [colorPickerColor, setColorPickerColor] = useState("#ffffffff");
  const [blurMode, setBlurMode] = useState(false);
  const [uploadImageList, setImageList] = useState([]);

  const [newColor, setNewColor] = useState({
    hue: 0,
    saturation: 100,
    lightness: 50,
    alpha: 1,
  })

  const onChangeColor = (hue, saturation, lightness, alpha) => {
    setNewColor({
      hue: parseInt(hue === -1 ? newColor.hue : hue),
      saturation: parseInt(saturation === -1 ? newColor.saturation : saturation),
      lightness: parseInt(lightness === -1 ? newColor.lightness : lightness),
      alpha: parseFloat(alpha === -1 ? newColor.alpha : alpha),
    });

    console.log('onChangeColor log - 1: ',
      hslHex(
        parseInt(hue === -1 ? newColor.hue : hue),
        parseInt(saturation === -1 ? newColor.saturation : saturation),
        parseInt(lightness === -1 ? newColor.lightness : lightness),
      )
      +
      Math.floor(parseFloat(alpha === -1 ? newColor.alpha : alpha) * 255).toString(16)
    );

    setColorPickerColor(
      hslHex(
        parseInt(hue === -1 ? newColor.hue : hue),
        parseInt(saturation === -1 ? newColor.saturation : saturation),
        parseInt(lightness === -1 ? newColor.lightness : lightness),
      )
      +
      Math.floor(parseFloat(alpha === -1 ? newColor.alpha : alpha) * 255).toString(16)
    );
  }

  useEffect(() => {
    const theme = JSON.parse(localStorage.getItem("website-theme"));
    if (theme) {
      setColorPickerColor(theme.backgroundColor);
      setBlurMode(theme.blurMode);
      setNewTheme({
        backgroundColor: theme.backgroundColor,
        backgroundImage: theme.backgroundImage,
        blurMode: theme.blurMode,
      });
    }
  }, []);

  const upgradeTheme = async (
    backgroundColor_u,
    backgroundImage_u,
    blurMode_u
  ) => {
    try {
      const tempTheme = {
        backgroundColor: backgroundColor_u,
        backgroundImage: backgroundImage_u,
        blurMode: blurMode_u,
      };

      localStorage.setItem("website-theme", JSON.stringify(tempTheme));
      setCookie(
        "updateThemeFlag",
        cookies.updateThemeFlag == "false" ? "true" : "false"
      );
      setNewTheme(tempTheme);
      setUpdateValue(!updateValue);
    } catch (e) {
      console.log(">>>>>>>>>>>>Exception", e);
    }
  };

  const handleUploadClick = (event) => {
    // try {
    //   var file = event.target.files[0];
    //   const reader = new FileReader();
    //   var url = reader.readAsDataURL(file);

    //   reader.onloadend = function (e) {
    //     var image = new Image();
    //     //Set the Base64 string return from FileReader as source.
    //     image.src = e.target.result;

    //     //Validate the File Height and Width.
    //     image.onload = function () {
    //       var height = this.height;
    //       var width = this.width;
    //       // if (height > 100 || width > 100)
    //       console.log(height, width);
    //     };

    //     let tempImageList = [...uploadImageList];
    //     if (!tempImageList.find((item) => item == image.src))
    //       tempImageList.push(image.src);
    //     setImageList(tempImageList);

    //     upgradeTheme(
    //       newTheme.backgroundColor,
    //       image.src,
    //       newTheme.blurMode
    //     );
    //     //console.log(">>>>>>>>>image", image.src, e.target);
    //   };
    // } catch (e) {
    //   console.log(">>>>>>>>>>>>>Exception", e);
    // }
  };

  // const [isDarkMode, setIsDarkMode] = useState(false);

  // useEffect(() => {
  //   if(localStorage.theme === undefined || localStorage.theme === null)
  //   {
  //     toDark();
  //   }
  //   else if (
  //     localStorage.theme === "dark" ||
  //     (!("theme" in localStorage) &&
  //       window.matchMedia("(prefers-color-scheme: dark)").matches)
  //   ) {
  //     toDark();
  //   } else {
  //     toLight();
  //   }
  // }, []);

  // const toDark = () => {
  //   setIsDarkMode(true);
  //   const root = document.querySelector("html");
  //   if (!root) return;
  //   !root.classList.contains("dark") && root.classList.add("dark");
  //   localStorage.theme = "dark";
  // };

  // const toLight = () => {
  //   setIsDarkMode(false);
  //   const root = document.querySelector("html");
  //   if (!root) return;
  //   root.classList.remove("dark");
  //   localStorage.theme = "light";
  // };

  // function _toogleDarkMode() {
  //   if (localStorage.theme === "light") {
  //     toDark();
  //   } else {
  //     toLight();
  //   }
  // }

  return (
    <Box>
      <IconButton
        onClick={() => setViewSettingDrawer(true)}
        // onClick={_toogleDarkMode}
        // className={`text-2xl md:text-3xl w-12 h-12 rounded-full text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none flex items-center justify-center ${className}`}
        sx={{
          color: '#6b7280',
          width: '48px',
          height: '48px',
        }}
      >
        <DisplaySettingsIcon sx={{
          width: '28px',
          height: '28px',
        }} />
        {/* <span className="sr-only">Enable dark mode1</span>
      {isDarkMode ? (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.03009 12.42C2.39009 17.57 6.76009 21.76 11.9901 21.99C15.6801 22.15 18.9801 20.43 20.9601 17.72C21.7801 16.61 21.3401 15.87 19.9701 16.12C19.3001 16.24 18.6101 16.29 17.8901 16.26C13.0001 16.06 9.00009 11.97 8.98009 7.13996C8.97009 5.83996 9.24009 4.60996 9.73009 3.48996C10.2701 2.24996 9.62009 1.65996 8.37009 2.18996C4.41009 3.85996 1.70009 7.84996 2.03009 12.42Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 18.5C15.5899 18.5 18.5 15.5899 18.5 12C18.5 8.41015 15.5899 5.5 12 5.5C8.41015 5.5 5.5 8.41015 5.5 12C5.5 15.5899 8.41015 18.5 12 18.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19.14 19.14L19.01 19.01M19.01 4.99L19.14 4.86L19.01 4.99ZM4.86 19.14L4.99 19.01L4.86 19.14ZM12 2.08V2V2.08ZM12 22V21.92V22ZM2.08 12H2H2.08ZM22 12H21.92H22ZM4.99 4.99L4.86 4.86L4.99 4.99Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )} */}
      </IconButton>
      <Drawer
        anchor="right"
        open={viewSettingDrawer}
        onClose={() => setViewSettingDrawer(false)}
      >
        <Box sx={DRAWER_STYLE}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => setViewSettingDrawer(false)}
            >
              <ListItemText
                primary={"Theme Setting"}
                sx={{
                  textTransform: "uppercase",
                  "& span": {
                    fontSize: "18px",
                    fontWeight: "700",
                  },
                }}
              />
              <ListItemIcon
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "right",
                }}
              >
                <ArrowForward />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
          <Divider sx={{
            borderColor: 'gray',
          }} />
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <AddPhotoAlternate />
              </ListItemIcon>
              <ListItemText primary={"Upload image"} />
              <input
                accept="image/*"
                // className={classes.input}
                style={{
                  opacity: 0,
                  position: "absolute",
                  width: "90%",
                }}
                id="contained-button-file"
                // multiple
                type="file"
                onChange={handleUploadClick}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => setViewColorSetDrawer(true)}
            >
              <ListItemIcon>
                <ColorizeSharp />
              </ListItemIcon>
              <ListItemText primary={"Set a color"} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => upgradeTheme("#ffffffff", "", false)}
            >
              <ListItemIcon>
                <RestartAlt />
              </ListItemIcon>
              <ListItemText primary={"Reset to default"} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() =>
                upgradeTheme(
                  newTheme.backgroundColor,
                  newTheme.backgroundImage,
                  !newTheme.blurMode
                )
              }
            >
              <ListItemIcon>
                {newTheme.blurMode ? (
                  <CheckBox />
                ) : (
                  <CheckBoxOutlineBlankOutlined />
                )}
              </ListItemIcon>
              <ListItemText primary={"Blurred"} />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <Box sx={{
              position: 'relative',
              width: '100%',
              height: '28px',
            }}>

              <Divider sx={{
                width: '100%',
                position: 'absolute',
                top: '12px',
                borderColor: 'gray',
              }} />
              <Box sx={{
                position: 'absolute',
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
                <Chip label="Default background"
                  sx={{
                    height: '28px',
                    color: 'white',
                    backgroundColor: '#13131d',
                    '& .MuiChip-label': {
                      fontSize: '11px',
                    }

                  }} />
              </Box>
            </Box>
          </ListItem>
          <Grid
            container
            spacing={1}
            sx={{
              padding: "10px",
            }}
          >
            {Wallpaper?.length > 0 &&
              Wallpaper.map((item) => (
                <Grid item xs={4}>
                  <Button
                    onClick={() =>
                      upgradeTheme(
                        "#ffffffff",
                        item.imageUrl,
                        newTheme.blurMode
                      )
                    }
                    sx={{
                      padding: "0",
                      margin: "0",
                    }}
                  >
                    <img
                      alt=""
                      src={item.thumbnail}
                      style={{
                        border: item.imageUrl === newTheme.backgroundImage ?
                          "3px solid white" : "1px solid gray",
                      }}
                    />
                  </Button>
                </Grid>
              ))}
          </Grid>
          <ListItem>
            <Box sx={{
              position: 'relative',
              width: '100%',
              height: '28px',
            }}>
              <Divider sx={{
                width: '100%',
                position: 'absolute',
                top: '12px',
                borderColor: 'gray'
              }} />
              <Box sx={{
                position: 'absolute',
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
                <Chip label="Uploaded background"
                  sx={{
                    height: '28px',
                    color: 'white',
                    backgroundColor: '#13131d',
                    '& .MuiChip-label': {
                      fontSize: '11px',
                    }

                  }} />
              </Box>
            </Box>
          </ListItem>
          <Grid
            container
            spacing={1}
            sx={{
              padding: "10px",
            }}
          >
            {uploadImageList.length > 0 &&
              uploadImageList.map((item) => (
                <Grid item xs={4}>
                  <Button
                    onClick={() =>
                      upgradeTheme(
                        "#ffffffff",
                        item,
                        newTheme.blurMode
                      )
                    }
                    sx={{
                      padding: "0",
                      margin: "0",
                    }}
                  >
                    <img
                      alt=""
                      src={item}
                      style={{
                        border: "1px solid gray",
                        width: "70px",
                        height: "70px",
                      }}
                    />
                  </Button>
                </Grid>
              ))}
          </Grid>
        </Box>
      </Drawer>
      <Drawer
        anchor="right"
        open={viewColorSetDrawer}
        onClose={() => setViewColorSetDrawer(false)}
      >
        <Box sx={DRAWER_STYLE}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => setViewColorSetDrawer(false)}
            >
              <ListItemText
                primary={"Set a color"}
                sx={{
                  "& span": {
                    fontSize: "18px",
                    fontWeight: "700",
                  },
                }}
              />
              <ListItemIcon
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "right",
                }}
              >
                <ArrowForward />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
          <Divider sx={{
            borderColor: 'gray',
          }} />
          <ListItem>
            <Box className="slider-group"
              sx={{
                width: '100%',
                '& .slider-container': {
                  height: '40px',
                  width: '100%',
                  padding: '10px 0',
                  marginTop: '15px',
                  '& input[type=range]': {
                    width: '100%',
                    '-webkit-appearance': 'none',
                    height: '16px',
                    borderRadius: '8px',
                    border: '1px solid lightgrey',
                    '&:focus': {
                      outline: 'none'
                    },
                  },
                  '& input[type=range]::-webkit-slider-thumb': {
                    boxShadow: '0 1px 1px 1px rgba(0,0,0,.2)',
                    border: '1px solid lightgrey',
                    height: '20px',
                    width: '20px',
                    borderRadius: '50px',
                    background: '#ffffff',
                    cursor: 'pointer',
                    '-webkit-appearance': 'none',
                    marginTop: '0px',
                  },
                  '& input[type=number]': {
                    position: 'absolute',
                    margin: '-5px 0',
                    padding: '0',
                    right: '20px',
                    width: '60px',
                    height: '26px',
                    textAlign: 'center',
                    '&:focus': {
                      outline: 'none'
                    },
                  },
                  '& label': {
                    width: '10%',
                    height: '24px',
                    lineHeight: '12px',
                    textAlign: 'center',
                    textTransform: 'capitalize',
                    '&:first-letter': {
                      // fontWeight: 'bold',
                    },
                  },
                  '& input[type=range], label': {
                    float: 'left',
                  },
                }
              }}>
              <Box className="slider-container">
                <label>hue</label>
                <input type="number" id="number-h" min="0" max="360" step="1"
                  value={newColor.hue}
                  onChange={e => onChangeColor(e.target.value, -1, -1, -1)} />
                <input type="range" id="slider-h" min="0" max="360" step="1"
                  style={{
                    background: '-webkit-linear-gradient(left, rgb(255, 0, 0), rgb(255, 85, 0), rgb(255, 170, 0), rgb(255, 255, 0), rgb(170, 255, 0), rgb(85, 255, 0), rgb(0, 255, 0), rgb(0, 255, 85), rgb(0, 255, 170), rgb(0, 255, 255), rgb(0, 170, 255), rgb(0, 85, 255), rgb(0, 0, 255), rgb(85, 0, 255), rgb(170, 0, 255), rgb(255, 0, 255), rgb(255, 0, 170), rgb(255, 0, 85), rgb(255, 0, 0))',
                  }}
                  value={newColor.hue}
                  onChange={e => onChangeColor(e.target.value, -1, -1, -1)} />
              </Box>
              <Box className="slider-container">
                <label>saturation</label>
                <input type="number" id="number-s" min="0" max="100" step="1"
                  value={newColor.saturation}
                  onChange={e => onChangeColor(-1, e.target.value, -1, -1)} />
                <input type="range" id="slider-s" min="0" max="100" step="1"
                  style={{
                    background: `-webkit-linear-gradient(left, rgb(128, 128, 128), hsl(${newColor.hue}, 100%, 50%))`,
                  }}
                  value={newColor.saturation}
                  onChange={e => onChangeColor(-1, e.target.value, -1, -1)} />
              </Box>
              <Box className="slider-container">
                <label>lightness</label>
                <input type="number" id="number-l" min="0" max="100" step="1"
                  value={newColor.lightness}
                  onChange={e => onChangeColor(-1, -1, e.target.value, -1)} />
                <input type="range" id="slider-l" min="0" max="100" step="1"
                  style={{
                    background: `-webkit-linear-gradient(left, rgb(0, 0, 0), hsl(${newColor.hue}, 100%, 50%), rgb(255, 255, 255))`,
                  }}
                  value={newColor.lightness}
                  onChange={e => onChangeColor(-1, -1, e.target.value, -1)} />
              </Box>
              <Box className="slider-container">
                <label>alpha</label>
                <input type="number" id="number-a" min="0" max="1" step="0.05"
                  value={newColor.alpha}
                  onChange={e => onChangeColor(-1, -1, -1, e.target.value)} />
                <input type="range" id="slider-a" min="0" max="1" step="0.05"
                  style={{
                    background: `-webkit-linear-gradient(left, hsla(${newColor.hue}, 100%, 50%, 0), hsl(${newColor.hue}, 100%, 50%))`,
                  }}
                  value={newColor.alpha}
                  onChange={e => onChangeColor(-1, -1, -1, e.target.value)} />
              </Box>
            </Box>
            {/* <ChromePicker
              color={colorPickerColor}
              onChangeComplete={(c) =>
                setColorPickerColor(
                  "#" +
                  rgbHex(
                    c.rgb.r,
                    c.rgb.g,
                    c.rgb.b,
                    c.rgb.a
                  )
                )
              }
            /> */}
          </ListItem>
          <ListItem>
            <Box sx={{
              position: 'relative',
              width: '100%',
              height: '50px',
              border: '1px solid gray',
            }}>
              <Box
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backgroundImage: 'url(./images/bg/bg-transparent.jpg)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backgroundColor: colorPickerColor,
                }}
              />
            </Box>
          </ListItem>
          <ListItem>
            <ListItemButton
              onClick={() =>
                upgradeTheme(colorPickerColor, "", false)
              }
              sx={{
                border: "1px solid white",
              }}
            >
              <ListItemText
                primary={"Use this color"}
                sx={{
                  textAlign: "center",
                }}
              />
            </ListItemButton>
          </ListItem>
        </Box>
      </Drawer >
    </Box >
  );
};

export default SwitchDarkMode;
