import { useEffect, useState } from "react";
import {UserManager, WebStorageStateStore} from "oidc-client-ts";
import { oidcConfig, userManager } from "../lib/auth";
import { AuthUser } from "../lib/auth";


export default function Callback() {

  const [loadingImage, setLoadingImage] = useState<string>("");

  useEffect(() => {
    userManager.signinRedirectCallback().then(user => {
      (async () => {  

        if(user && user.profile && user.profile.picture)
        {
          setLoadingImage(user.profile.picture);
        }

        console.log("Logged in user:", user.profile.picture);
        await delay(600);
        //wait a moment to debug to see console log
        window.location.href = "/"; // send them back to home
      })();
      
    }).catch(err => {
      console.error("Error during signin redirect callback:", err);
    });
  }, []);


  return (
    
    <div
      style={{
        position: "fixed",
        inset: 0,                  // top:0,right:0,bottom:0,left:0
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",  // vertical center
        alignItems: "center",      // horizontal center
        width: "100vw",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <img
        src={loadingImage}
        width={120}
        height={120}
        style={{ imageRendering: "auto" }}
      />
      <p style={{ fontFamily: "sans-serif", marginTop: "1rem" }}>Signing in...</p>
    </div>
  );



}

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}