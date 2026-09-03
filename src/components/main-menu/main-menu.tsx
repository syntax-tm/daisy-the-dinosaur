import { SwipeableDrawer } from "@mui/material";
import { useState } from "react";

export interface MainMenuItemProps {

}

export const MainMenuItem = (props: MainMenuItemProps) => {

  return (
    <>
      <div>
      </div>
    </>
  );

}

export const MainMenu = () => {

  const [isOpen, setIsOpen] = useState(false);
  const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

  <SwipeableDrawer
      anchor="bottom"
      open={isOpen}
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
    >
      
  </SwipeableDrawer>

};

export { MainMenu as default };
