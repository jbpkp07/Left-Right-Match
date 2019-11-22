import axios from 'axios';

export default {

    getAllCandidates: function () {

        const axiosConfig = {
            
            withCredentials: true
        };

        return axios.get("/api/candidates", axiosConfig);
    },

    getCandidate: function (id) {

        const axiosConfig = {
            
            withCredentials: true
        };

        return axios.get("/api/candidates/" + id, axiosConfig);
    },

    getQuestions: function () {

        const axiosConfig = {
            
            withCredentials: true
        };

        return axios.get("/api/quiz", axiosConfig);
    },

    postUserAnswers: function (answersData) {

        const axiosConfig = {
            
            withCredentials: true
        };

        return axios.post("/api/quiz", answersData, axiosConfig);
    },

    getUserProfile: function(id) {

        const axiosConfig = {
            
            withCredentials: true
        };

        return axios.get("/api/user/" + id, axiosConfig);
    },

    startSession: function() {

        const axiosConfig = {
            
            withCredentials: true
        };

        return axios.get("/api/sessions/start", axiosConfig);
    },

    login: function(creds) {

        const axiosConfig = {
            
            withCredentials: true
        };

        return axios.post("/api/sessions/login", creds, axiosConfig);
    },

    signup: function(info) {

        const axiosConfig = {
            
            withCredentials: true
        };

        return axios.post("/api/sessions/signup", info, axiosConfig);
    },
    
    logout: function() {

        const axiosConfig = {
            
            withCredentials: true
        };

        return axios.get("/api/sessions/logout", axiosConfig);
    },
};