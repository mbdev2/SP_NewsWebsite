export class Komentar {
  avtor: string;
  besedilo: string;
}

export class Clanek {
    _id : string;
    naslov: string;
    kraj: string;
    datum: Date;
    caption: string;
    slika: string;
    clanektext: string;
    avtor: string;
    avtorVzdevek: string;
    komentarji: Komentar[];
    kategorija: string;
}
