export interface IApiRoutes {

    candidatesRoute: string;
    loginRoute: string;
    matchRoute: string;
    quizRoute: string;
}

export const apiRoutes: IApiRoutes = {

    candidatesRoute: "/api/candidates",
    loginRoute: "/api/login",
    matchRoute: "/api/match",
    quizRoute: "/api/quiz"
};