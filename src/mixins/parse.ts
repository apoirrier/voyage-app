import Parse from 'parse';
import VueSimpleAlert from 'vue3-simple-alert';

export default {
    methods: {
        _manageError(answer: any, caller: any) {
            if(answer === undefined || answer.code >= 500) {
                VueSimpleAlert.alert("Impossible de se connecter à Parse... Veuillez réessayer ou contacter un administrateur.");
            } else if(answer.code === 403) {
                VueSimpleAlert.alert("Veuillez vous connecter");
            } else if(answer.code === 400) {
                VueSimpleAlert.alert("Impossible de créer une région: " + String(answer.error));
            } else if(answer.code === 404) {
                caller.$router.push('/404');
            }
            else if(answer.code === 209) {
                localStorage.removeItem("Parse/" + process.env.VUE_APP_PARSE_APP_ID + "/currentUser");
                VueSimpleAlert.alert("Rechargement de la page", "Session expirée", "error").then(() => {
                    location.reload();
                });
            }
            else
                VueSimpleAlert.alert("Erreur inconnue: code " + answer.code);
        },
        callParse(apiFunction: string, parameter: any, callback: (a:any) => any, caller: any) {
            Parse.Cloud.run(apiFunction, parameter).then((answer: any) => {
                if(answer.code === 200)
                    callback(answer);
                else
                    this._manageError(answer, caller);
            }).catch((answer: any) => {
                this._manageError(answer, caller);
            });
        }
    }
}