import { Injectable } from '@angular/core';

// import { environment } from '@environment';

@Injectable({
    providedIn: 'root',
})
export class HelperService {

    constructor() {
    }

    // source: https://medium.com/@mhagemann/the-ultimate-way-to-slugify-a-url-string-in-javascript-b8e4a0d849e1

    public slugify(string: string): string {
        const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
        const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
        const p = new RegExp(a.split('').join('|'), 'g');

        return ("" + string).toLowerCase()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
            .replace(/&/g, '-and-') // Replace & with 'and'
            .replace(/[^\w\-]+/g, '') // Remove all non-word characters and -
            .replace(/\-\-+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, '') // Trim - from end of text
    }

    public getSafeFileName(string: string): string {
        const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż';
        const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz';
        const p = new RegExp(a.split('').join('|'), 'g');

        return ("" + string).toLowerCase()
            .replace(/\s+/g, '_') // Replace spaces with _
            .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
            // .replace(/&/g, '-and-') // Replace & with 'and'
            .replace(/[^\w|\_|\-]+/g, '') // Remove all non-word characters (a-z, A-Z, 0-9, _, -)
            // .replace(/\-\-+/g, '-') // Replace multiple - with single -
            // .replace(/^-+/, '') // Trim - from start of text
            // .replace(/-+$/, '') // Trim - from end of text
    }
}
