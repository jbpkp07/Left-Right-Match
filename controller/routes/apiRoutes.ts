export interface IApiSessionRoutes {

    loginRoute: string;
    logoutRoute: string;
    signupRoute: string;
    startRoute: string;
}

export interface IApiRoutes {

    candidatesRoute: string;
    quizRoute: string;
    userRoute: string;
    sessionRoutes: IApiSessionRoutes;
}

export const apiRoutes: IApiRoutes = {

    candidatesRoute: "/api/candidates",
    quizRoute: "/api/quiz",
    userRoute: "/api/user",
    sessionRoutes: {

        loginRoute:  "/api/sessions/login",
        logoutRoute: "/api/sessions/logout",
        signupRoute: "/api/sessions/signup",
        startRoute:  "/api/sessions/start"
    }
};