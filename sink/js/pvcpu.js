
/*------------------------------------------
 Funcions per al funcionament bàsic del joc 
 ------------------------------------------*/


window.addEventListener("load", funcioInicial, true);


/**
 * Funció d'inicialització de la partida
 */
function funcioInicial(){   
    
    //creació Objectes i variables
    createTables();
    fleetA = {};
    fleetB = {};
    fleetPlayingA={};
    fleetPlayingB={};
    fleetMissedA={};
    fleetMissedB={};
    puntuacioA=0;
    puntuacioB=0;
    sound = document.createElement('audio');
    
    //Assignació dels paràmetres a taules:
    $pAownBoard=$('#ownBoardA table');
    $pBownBoard=$('#ownBoardB table');
    $pBoardA=$('#boardA td');
    $pBoardB=$('#boardB td');
    
    //creació de variable aleatòria per a la disposició aleatòria dels vaixells
    pArandom=getRandomInt(1,3);
    pBrandom=getRandomInt(1,3);

    //ompliment Objectes
    initializeFleet(fleetA,pArandom);
    initializeFleet(fleetB,pBrandom);

    //Ompliment gràfic de la taula segons objectes
    fillFleet(fleetA,$pAownBoard);
    fillFleet(fleetB,$pBownBoard);
    
    
    //crida de funció per a iniciar la partida
    if (endGame()==false)
        play($pBoardA,fleetB,fleetPlayingA,fleetMissedA);

    //recarrega la pàgina   
    document.getElementById("resetBtn").addEventListener('click',reinicia,true);
}


/**
 * Funció per a jugar. crida un callback que ompleix el tauler depenent de la flota enemiga.
 * Afegeix puntuació i un cop feta, crida la funció de jugada de la cpu.
 * @param {$} obj objecte query amb el tauler omplert.
 * @param {obj} fleet objecte omplert de la flota Rival
 * @param {obj} fleetHit objecte flota amb les casselles tocades
 * @param {obj} fleetMissed objecte flota amb les casselles fallades
 */
function play(obj,fleet,fleetHit,fleetMissed){
    var newShot;
    
    obj.bind('click', function(){
        setTimeout('cpuTurn()',500);
        if (hitAShip($(this).attr('id'),fleet)==true) { //si toca vaixell
            $(this).addClass('hit').fadeTo(800,1);
            newShot = $(this).attr('id');
            fleetHit[newShot]=true;
            puntuacioA+=20;
            puntuacioB-=10;
            $('#scoreA p').text(puntuacioA);
            $('#scoreB p').text(puntuacioB);
        
            //reproducció del so
            sound.src = Modernizr.audio.ogg ? 'audio/boom.ogg' : 'audio/boom.mp3' ;
            sound.play();
            
        } else {  //si no toca vaixell
            $(this).addClass('miss').fadeTo(600,1);
            newShot = $(this).attr('id');
            fleetMissed[newShot]=true;

            //reproducció del so
            sound.src = Modernizr.audio.ogg ? 'audio/splash.ogg' : 'audio/splash.mp3' ;
            sound.play();
        }
        endGame();
    });
}


/**
 * Jugades del torn de la cpu.
 */
function cpuTurn(){
    var rndmNum = getAndEvalRndmNum();
    
    if (hitAShip(rndmNum,fleetA)){
        $('#boardB td'+'#'+rndmNum).addClass('hit').fadeTo(500,1);
        fleetPlayingB[rndmNum]=true;
        puntuacioA-=10;
        puntuacioB+=20;
        $('#scoreA p').text(puntuacioA);
        $('#scoreB p').text(puntuacioB);
    } else {
        $('#boardB td'+'#'+rndmNum).addClass('miss').fadeTo(300,1);
        fleetMissedB[rndmNum]=true;
    };
    
};


/**
 * Evalua el final de la partida i mostra un missatge amb la puntuació
 * de la partida i la puntuació més alta o missatge de partida perduda.
 * Inhabilita el joc fins que no es fa un de nou
 */
function endGame() {
    if (Object.keys(fleetPlayingA).length == 17) {
        $pBoardA.unbind();
        saveScore();
        alert('Has guanyat!\nPuntuació: '+ puntuacioA+ ' punts.'
            +'\nLa puntuació més alta és ' + getMaxValue() + 'punts.' 
            +'\nFes click al botó de reset per tornar a Jugar');
        return true;
    } else if (Object.keys(fleetPlayingB).length == 17) {
        alert('Paquete, t\'ha guanyat la CPU!\nFes click al botó de reset per tornar a Jugar');
        $pBoardA.unbind();
        return true;  
    } else {
        return false;
    }
}


/**
 * Comprova si l'id a tractar té està contingut dins la flota tocada. És a dir,
 * comprova si el tir ha tocat un vaixell.
 * @param {id} String nom de l'id a comprovar
 * @param {obj} fleet objecte flota a comprovar
 * Retorna un boleà. 
 */
function hitAShip(id,fleet) {
    var hit=false;
    for (i in fleet)
        if (id == i) hit=true;
        
    return hit;
}


/**
 * Evalua si el navegador suporta les sessions i desa la nova puntuació mitjançant un hashCode
 */
function saveScore() {
    if (window.sessionStorage){
        var hashCode = getRandomInt(1,99);
        sessionStorage.setItem('puntuacio'+hashCode,puntuacioA);
    } else{
        alert('La puntuació no ha estat desada.\n Navegador no suportat');
    } 
}


/**
 * Comprova que el nombre aleatori introduït no hagi estat introduit prèviament
 */
function getAndEvalRndmNum() {
    var alreadyShot = true;

    do {
        var x = getRandomInt(0,100);    
        if (!fleetPlayingB.hasOwnProperty(x)
            && !fleetMissedB.hasOwnProperty(x))
            alreadyShot=false;
    } while (alreadyShot==true);
    
    if (x < 10 && x >=0)  x = '0' + x;

    return x
}


/**
 * Omple una taula amb els objectes de la flota
 * @param {obj} obj objecte flota a omplir
 * @param {$} x objecte jQuery de tipus taula
 */
function fillFleet(obj,x) {
    for (i in obj)
        x.find('td#'+i).addClass('ship');
    
    return obj;
}



/*------------------------------------------
 Funcions adicionals 
 ------------------------------------------*/

/**
 * reinicia la jugada recarregant el navegador
 */
function reinicia() {
    window.location.reload();
}


/**
 * Retorna un enter comprés entre els nombres min i max
 * @param {int} min enter més petit
 * @param {int} max enter més gran
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/**
 * Crea una taula amb ids corresponents
 */
function createTable () {
    var table = '<table>';
    for (j = 0; j < 10; j++) {
        table += '<tr>';
        for (i = 0; i < 10; i++)
            table += '<td id="'+j+i+'"></td>';
        table += '</tr>';
    } table += '</table>';
	return table;
}


/**
 * Crea una taula amb ids corresponents
 */
function createTables () {
	//Crear Taules
	$('#ownDisplayA').append(createTable());
	$('#boardA').append(createTable());
	$('#ownDisplayB').append(createTable());
	$('#boardB').append(createTable());
}


/**
 * Funció que retorna el valor Màxim a la sessió
 */
function getMaxValue() {
    var valueMax=0;
    for (var i=0, leng = sessionStorage.length; i < leng; i++){
        var value = sessionStorage.getItem(sessionStorage.key(i));
        if (value > valueMax) valueMax=value;
    } 
    return valueMax;
}



/*------------------------------------------------
 Funcions temporals (Per implementar més endavant) 
 ------------------------------------------------*/

/**
 * Inicialitza l'objecte flota i afegeix com a propietat cada vaixell amb
 * les seves coordenades
 * @param {Object} obj objecte flota
 * @param {int} opt variable per escollir la flota que vé d'un nombre aleatori
 */
function initializeFleet(obj,opt) {
	
	if (opt==1) {
		ship2: {
			obj[22] = true;
			obj[23] = true;
		};
		ship3a: {
			obj[44] = true;
			obj[45] = true;
			obj[46] = true;
		};
		ship3a: {
			obj[74] = true;
			obj[84] = true;
			obj[94] = true;
		};
		ship4: {
			obj[42] = true;
			obj[52] = true;
			obj[62] = true;
			obj[72] = true;
		};
		ship5: {
			obj[29] = true;
			obj[39] = true;
			obj[49] = true;
            obj[59] = true;
            obj[69] = true;
		};
	}
	if (opt==2) {
		ship2: {
			obj[50] = true;
			obj[60] = true;
		};
		ship3a: {
			obj[61] = true;
			obj[62] = true;
			obj[63] = true;
		};
		ship3a: {
			obj[90] = true;
			obj[91] = true;
			obj[92] = true;
		};
		ship4: {
			obj[31] = true;
			obj[32] = true;
			obj[33] = true;
			obj[34] = true;
		};
		ship5: {
			obj[10] = true;
			obj[11] = true;
			obj[12] = true;
			obj[13] = true;
			obj[14] = true;
		}
	}
	if (opt==3) {
		ship2: {
			obj[78] = true;
			obj[79] = true;
		};
		ship3a: {
			obj[39] = true;
			obj[29] = true;
			obj[19] = true;
		};
		ship3b: {
			obj[90] = true;
			obj[91] = true;
			obj[92] = true;
		};
		ship4: {
			obj[52] = true;
			obj[53] = true;
			obj[54] = true;
			obj[55] = true;
		
		};
		ship5: {
			obj[83] = true;
			obj[84] = true;
			obj[85] = true;
			obj[86] = true;
			obj[87] = true;
		}
	}
	return obj;
}
