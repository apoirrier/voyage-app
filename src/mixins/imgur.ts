import axios from 'axios';

export default {
    methods: {
        upload(file: string) {
            let formData = new FormData();
            formData.append("image", file);
            return axios.post("https://api.imgur.com/3/image",
                        formData,
                        {
                            headers: {
                                'Authorization': "Client-ID " + process.env.VUE_APP_IMGUR_ID
                            }
                        }).then((answer: any) => {
                            return answer.data.data.link;
                        })
        }
    }
}