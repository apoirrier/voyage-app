import axios from 'axios';
import { IMGUR_CONFIG } from '../config/parse';

export default {
    methods: {
        upload(file: string) {
            let formData = new FormData();
            formData.append("image", file);
            return axios.post("https://api.imgur.com/3/image",
                        formData,
                        {
                            headers: {
                                'Authorization': "Client-ID " + IMGUR_CONFIG.CLIENT_ID
                            }
                        }).then((answer: any) => {
                            return answer.data.data.link;
                        }).catch(() => {
                            return null;
                        });
        },
        getImageUrl(image: any) {
            if(image === undefined)
                return "/images/undefined";
            if(typeof image.url === 'function')
                return image.url();
            return image;
        }
    }
}