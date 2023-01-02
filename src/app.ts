//recupérer element form avec le querySelector
const form = document.querySelector<HTMLFormElement>("form")!;

//recupérer element age avec le querySelector
const ageInput = document.querySelector<HTMLInputElement>("#age")!;

//recupérer element themes avec le querySelector
const themesInput = document.querySelector<HTMLInputElement>("#themes")!;

//recupérer element themes avec le querySelector
const submitButton = document.querySelector<HTMLButtonElement>("button")!;

//recupérer element themes avec le querySelector
const footer = document.querySelector<HTMLFormElement>("footer")!;

//cle de l'api
const OPENAI_API_KEY = "#######################";

/**
 * transformer 35 et "legos, jeux vidéos"
 * en
 * "propose moi 5 idées de cadeau pour une personne agées de 35 ans et aui aime légos, jeux vidéos"
 */
const generatePromptByAgeAndThemes = (age: number, themes="") => {

    let prompt = `Propose moi, avec un ton joyeux et amical 5 idées de cadeau pour une personne agées de ${age} ans `;
    
    if(themes.trim()) {
        prompt += ` et qui aime ${themes}`;
    }

    return prompt + " !";
};

/*****************************************************************function ********************/


/**
 * Mettre le bouton et le footer en mode loqding
 */
const setLoadingItem = () => {

    //mettre un texte dans le footer
    footer.textContent = "Chargement de supers idees en cours !";
    //mettre un icon de loading grace a piccocss
    footer.setAttribute("aria-busy", "true");
    //mettre un icon de loading sur le bouton
    submitButton.setAttribute("aria-busy", "true");
    //enlever la possibilite de recliquer dessus
    submitButton.disabled = true;
};


/**
 *  Enlever le mode loqding du bouton et du footer
 */
const removeLoadongItems = () => {

    //enlever l'icon de loading grace a piccocss
    footer.setAttribute("aria-busy", "false");
    //enlever l'icon de loading grace a piccocss    
    submitButton.setAttribute("aria-busy", "false");
    //remettre le bouton 
    submitButton.disabled = false;

};


/**
 * Transformer 
 * "hello\nComment alleez vous ?
 * en
 * "<p>Hello</p><p>Comment allez vous ?</p>"
 */
 const translateTextToHtml = (text: string) => 
    text
        //split des qu'il y a un antislash et il fera un tqbleau de petite phrase
        .split("\n")
        //changer les petite phrase en paragraphe
        .map((str) => `<p>${str}</p>`)
        //et joindre une chaine vide qui permettra d'obtenir notre text html
        .join("");


        
/**
 * Lancer tous le systeme lorsque le formulaire est soumis
 */
form.addEventListener("submit", (e) => {
    //annuler le rechargement de la page
    e.preventDefault();

    //Mettre en mode loqding lke footer et le bouton
    setLoadingItem();

    //Appeler l'API en lui passant la question
    fetch(`https://api.openai.com/v1/completions`, {
        //method
        method: "POST",
        //entette
        headers: {
            //le contenu de l'entete
            "Content-Type": "application/json",
            //mettre une autorisatioon
            Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        //le corp de la requete doit etre en string et on peut utiliser JSON.stringify pour le faire
        body: JSON.stringify({
            //on va utiliser la fonction que nous avons cree
            prompt: generatePromptByAgeAndThemes(
                ageInput.valueAsNumber,
                themesInput.value
            ),
            //nombre max de token en gros le nombre de caractere 
            max_tokens: 2000,
            //le model sert a la completions
            model: "text-davinci-003",
        }),
    })
        //Tranformer la reponse en json
        .then((response) => response.json())
        .then((data) => {
            //changer le HTML a l'interieur du footer pour ca on recupere le tableau
            footer.innerHTML = translateTextToHtml(data.choices[0].text);
        })
        .finally(() =>{
            //supprimer le mode loading du footer et du bouton
            removeLoadongItems();
        });

});







