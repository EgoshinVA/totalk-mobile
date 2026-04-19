import {HomePage} from "@/pages/home/ui/HomePage";
import {useRouter} from "expo-router";

export default function MainScreen() {
    const router = useRouter();

    const handleStartClick = () => {
        router.replace('/(auth)/login');
    }

    return <HomePage onGetStarted={handleStartClick}/>;
}