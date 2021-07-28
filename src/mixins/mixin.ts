export default {
    methods: {
        sanitize: function(input: string) {
            const map: {[char: string]: string} = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;',
                "/": '&#x2F;',
            };
            const reg = /[&<>"'/]/ig;
            return input.replace(reg, (match)=>(map[match]));
        }
    }
}