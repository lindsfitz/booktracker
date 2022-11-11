import { useEffect, useRef, useContext } from "react";
import API from '../../../utils/API';
import { Link } from "@mui/material";
import AppContext from "../../../AppContext";


const CloudWidget = ({ options }) => {

    const cloudRef = useRef();
    const widgetRef = useRef();

    const context = useContext(AppContext)


    useEffect(() => {

        cloudRef.current = window.cloudinary
        widgetRef.current = cloudRef.current.createUploadWidget({
            cloudName: options.cloudname,
            apiKey: options.apikey,
            uploadPreset: 'fyn6gmmw',
            folder: 'booktracker',
            public_id: context.userData.id,
            sources: ['local'],
            cropping: true,
            styles: {
                palette: {
                    window: "#F5F5F5",
                    sourceBg: "#FFFFFF",
                    windowBorder: "#839DA2",
                    tabIcon: "#8883A2",
                    inactiveTabIcon: "#69778A",
                    menuIcons: "#8883A2",
                    link: "#4D5651",
                    action: "#4D5651",
                    inProgress: "#8883A2",
                    complete: "#839DA2",
                    error: "#c43737",
                    textDark: "#000000",
                    textLight: "#FFFFFF"
                },
                fonts: {
                    default: null,
                    "'Poppins', sans-serif": {
                        url: "https://fonts.googleapis.com/css?family=Poppins",
                        active: true
                    }
                }
            },
        }, async (error, result) => {
            if (!error && result && result.event === "success") {
                console.log("Done! Here is the image info: ", result.info);
                const profile = {
                    profile_picture: result.info.secure_url
                }
                const update = await API.updateProfile(context.userData.id, profile);
                console.log(update)
            }
        })

        // load()

    }, [])

    return (
        <Link onClick={() => widgetRef.current.open()} underline='hover' sx={{
            '&:hover': {
                cursor: 'pointer'
            },
        }} color='secondary' variant='caption'>update photo</Link>

    )

}


export default CloudWidget;