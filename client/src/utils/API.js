import axios from 'axios';

export default {

    getQuestions: function () {
        return axios.get("/api/questions/");
    },

    getAllCandidates: function () {
        console.log("API getAllCandidates hit")
        return axios.get("/api/candidates");
    },

    getCandidate: function (id) {
        console.log('API.js getCandidate(id)= ', id)
        return axios.get("/api/candidates/" + id);
    },

    getUserProfile: function(id) {
        return axios.get("/api/userprofile/" + id)
    },

    saveUserAnswers: function (answersData) {
        console.log('ansData', answersData)
        return axios.post("/api/answers", answersData);
    },
    
    getCandidateMatches: function (id) {
        console.log('API getMatch id= ', id)
        return axios.get("/api/candidatematches/" + id);
    }
};