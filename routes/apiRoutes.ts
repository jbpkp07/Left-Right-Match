export interface IApiRoutes {

    loginRoute: string;
    matchRoute: string;
    quizRoute: string;
    scrapeRoute: string;
}

export const apiRoutes: IApiRoutes = {

    loginRoute: "/api/login",
    matchRoute: "/api/match",
    quizRoute: "/api/quiz",
    scrapeRoute: "/api/scrape"
};