import { useLocalStorage } from "@uidotdev/usehooks";

function useAlert() {
    const [message, setMessage] = useLocalStorage("DialogMessage", null); // {message: "string", error: "boolean"}

    const onClose = () => setMessage(null);
    const onOpen = ({ title, message, error = false }) =>
        setMessage({
            title,
            message,
            error,
        });

    console.log(message);

    return {
        message,
        onClose,
        onOpen,
    };
}

export default useAlert;
