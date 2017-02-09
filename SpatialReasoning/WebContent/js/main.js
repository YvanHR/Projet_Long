// Informations à persister
var user = "test";
var curr_image;
var curr_rep;


var study_data;

// Ordre des images pendant l'étude
var img_ids = [];
// Définit quelle représentation est utilisée pour chaque image
var representations = [];

var progress = 0;
var started = false;

function doLoad() {
	
	loadJSON();

}

function loadJSON() {
	// Récupération du fichier JSON
	var xhr_object=new XMLHttpRequest();

	xhr_object.open("GET","JSON/description_fr.json",false);
	xhr_object.onreadystatechange  = function() { 
	     if(xhr_object.readyState  == 4) {
				var aux = eval('('+xhr_object.responseText+')');
				study_data = aux.images;
				
				prepareStudy();
				
				setupNewImage();
				
	     }
	}; 
	xhr_object.send(null);
}

function prepareStudy() {
	// Pour l'étude il faut : 
	//	1) Tirer un ordre au sort pour les images
	//	2) Pour chaque image, décider quelle représentation sera utilisée
	//			1: Image réelle
	//			2: Image réelle + gaussiennes
	// 			3: Gaussiennes seules
	for (var i=0; i<study_data.length; i++) {
		img_ids.push(i);
		representations.push((i%3) + 1);
	}
	img_ids = shuffleArray(img_ids);
	representations = shuffleArray(representations);
		
	// Mise en place du bouton de lancement du sondage
	var btnElt = document.getElementById("StartButton");
	btnElt.addEventListener("click", nextTask, false);
	
	// Mise en place du bouton Next
	var btnElt = document.getElementById("NextButton");
	btnElt.addEventListener("click", nextTask, false);
		
	console.log(img_ids)
	console.log(representations)
}

function nextTask() {
	
	/*
		if (!started) {
			setupHomePage();
			console.log("start successful");
			
			started = true;
		} else {
	*/
	
	// Vérifier qu'une checkbox a été cochée
	var idChecked = checkRadioButtons();
		
	if (idChecked) {
		// Enregistrer la réponse en BD
		persistRelation(idChecked);
		
		progress++;
				
		if (progress == img_ids.length) {
			setupStudyEnd();
		} else {
			setupNewImage();		
		}
	} else {
		window.alert("N'oubliez pas de sélectionner une réponse avant de passer à l'image suivante.")
	}
}

function checkRadioButtons() {
	var aux = "";
	
	var bw12 = document.getElementById("B_1_2");
	var bw13 = document.getElementById("B_1_3");
	var bw23 = document.getElementById("B_2_3");
	var m12 = document.getElementById("M_1_2");
	var m13 = document.getElementById("M_1_3");
	var m23 = document.getElementById("M_2_3");
	var none = document.getElementById('None');
	
	aux = aux || bw12.checked && "B_1_2";
	aux = aux || bw13.checked && "B_1_3";
	aux = aux || bw23.checked && "B_2_3";
	aux = aux || m12.checked && "M_1_2";
	aux = aux || m13.checked && "M_1_3";
	aux = aux || m23.checked && "M_2_3";
	aux = aux || none.checked && "None";
	
	return aux;
	
}

function setupNewImage() {

	// On cache le boutton de démarrage
	hideElement("StartButton");
	
	var progressElt = document.getElementById("progress");
	progressElt.innerHTML = "Question " + (progress+1) + "/" + img_ids.length;
		
	// Nom de l'image
	var representation_type = "";
	var names_aux = study_data[img_ids[progress]];
	var names;
	switch (representations[progress]) {
		case 1:
			representation_type = "Real";
			curr_rep = 'R';
			names = [names_aux.object1, names_aux.object2, names_aux.object3];
			break;
		case 2:
			representation_type = "Gaussian+Real";
			curr_rep = 'GR';
			names = [names_aux.object1, names_aux.object2, names_aux.object3];
			break;
		case 3:
			representation_type = "Gaussian";
			curr_rep = 'G';
			names = ["l'objet " + names_aux.color1, "l'objet " + names_aux.color2, "l'objet " + names_aux.color3];
			break;
	}

	var image_name = "imageSC_" + (img_ids[progress]+3) + "_" + representation_type + ".png";
	curr_image = "imageSC_" + (img_ids[progress]+3);
	
	var imgElt = document.getElementById('image');
	imgElt.src = "Images/" + image_name;
	
	
	var pElt = document.getElementById('radioButtons');
	pElt.innerHTML = "";

	// A rendre aléatoire
	addRadioButton(names, 1, 2);
	addRadioButton(names, 1, 3);
	addRadioButton(names, 2, 3);

	pElt.innerHTML += "<input type='radio' name='between' value='None' id='None'/>";
	pElt.innerHTML += "Aucun objet n'est entre les/ au milieu des deux autres<br/>";
		
}

function addRadioButton(names, id_obj1, id_obj2) {	
	var id_obj3 = 6 - id_obj1 - id_obj2;
	
	var pElt = document.getElementById('radioButtons');

	var nameId = "B_" + id_obj1 + "_" + id_obj2;
	pElt.innerHTML += "<input type='radio' name='between' value='" + nameId + "' id='" + nameId + "'/>";
	pElt.innerHTML += names[id_obj3-1] + " se trouve entre " + names[id_obj1-1] + " et " + names[id_obj2-1] + "<br/>";

	nameId = "M_" + id_obj1 + "_" + id_obj2;
	pElt.innerHTML += "<input type='radio' name='between' value='" + nameId + "' id='" + nameId + "'/>";
	pElt.innerHTML += names[id_obj3-1] + " se trouve au milieu de " + names[id_obj1-1] + " et de " + names[id_obj2-1] + "<br/>";
	
}

// Génère la page d'accueil
function setupHomePage() {

	// Texte d'introduction
	var textIntro = "Voici ce que nous attendons de vous : nous allons vous présenter une série de quelques photos comportant divers objets. Nous allons ensuite vous poser des questions en rapport avec ces objets, que nous préciserons dans les questions. Votre objectif est de choisir la réponse que vous trouvez la plus pertinente. Vous choississez celle qui vous paraît la plus plausible parmi les diverses nuances qui vous serons proposées, il n'y pas de bonne ou de mauvaise réponse."
	var pElt = document.getElementById('study_wrapper');
	
	pElt.innerHTML += "<p>" + "Bienvenue et merci de prendre le temps de participer à ce sondage !"+ "</p>";
	pElt.innerHTML += "<p>" + textIntro + "</p>";

	// Image de présentation
	var imgElt = document.getElementById('image');
	imgElt.src = "Images/image_descriptive.png";
	
}

function setupStudyEnd() {

	var btnElt = document.getElementById("NextButton");
	btnElt.removeEventListener("click", nextTask, false);
	
	hideElement("study_wrapper");
	displayElement("study_end");
}

function hideElement(id) {
	var e = document.getElementById(id);
	e.style.display = "none";
}

function displayElement(id) {
	var e = document.getElementById(id);
	e.style.display = "inline-block";
}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function persistRelation(selection) {
	
	var aux = selection.split("_");
	var obj;
	var relation;
	
	if (aux.length==1) {
		relation = 'N';
		obj = 0;
	} else {
		relation = aux[0];
		var id1 = parseInt(aux[1]);
		var id2 = parseInt(aux[2]);
		obj = 6 - id1 - id2;
	}
	
	
	
	var xhr_object = new XMLHttpRequest();

	xhr_object.open("POST", "PersistRelationServlet", false);
	xhr_object.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr_object.onreadystatechange = function() { 
	     if(xhr_object.readyState == 4) {
				
	     }
	};
	xhr_object.send('user='+user +'&image='+curr_image+'&representation='+curr_rep+"&object="+obj+"&relation="+relation);

}
