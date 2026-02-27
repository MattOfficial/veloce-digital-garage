import nlp from 'compromise';

const doc1 = nlp("Refuelled toyota with 4000 rupees worth of petrol.");
console.log("Doc 1 numbers:", doc1.numbers().json());

const doc2 = nlp("4000");
console.log("Doc 2 numbers:", doc2.numbers().json());
