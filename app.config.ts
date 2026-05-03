export default {
    expo: {
        name: "ToTalk",
        slug: "my-expo-app",
        owner: "t0rr1n",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/icon.png",
        userInterfaceStyle: "light",

        android: {
            package: "com.vitaliy.totalk",
            adaptiveIcon: {
                foregroundImage: "./assets/icon.png",
                backgroundColor: "#ffffff"
            },
            permissions: ["RECORD_AUDIO"]
        },

        plugins: [
            "expo-dev-client"
        ],

        extra: {
            BASE_API: process.env.BASE_API || 'http://192.168.31.88:8080/api/v1',
            eas: {
                projectId: "562da1ae-1205-457e-a581-6a10fbceaba4"
            }
        },

        updates: {
            url: "https://u.expo.dev/562da1ae-1205-457e-a581-6a10fbceaba4"
        },
        runtimeVersion: {
            policy: "appVersion"
        }
    },
};