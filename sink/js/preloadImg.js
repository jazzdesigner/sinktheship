/**
 * Precàrrega d'imatges
 */
if (document.images){
    
    preload_image_object = new Image();
    image_url = new Array();
    image_url[0] = "img/bg.jpg";
    image_url[1] = "img/bgTop.png";
    image_url[2] = "img/headerLogo.png";
    image_url[3] = "img/boardA.png";
    image_url[4] = "img/boardB.png";
    image_url[5] = "img/ownDisplayA.png";
    image_url[6] = "img/ownDisplayB.png";
    image_url[7] = "img/labelA.png";
    image_url[8] = "img/labelB.png";
    image_url[9] = "img/scoreA.png";
    image_url[10] = "img/scoreB.png";
    image_url[11] = "img/bgBottom.png";
    image_url[12] = "img/resetBtnNormal.png";
    image_url[13] = "img/resetBtnOver.png";
    image_url[14] = "img/bottomMenu.png";
    image_url[15] = "img/turnLightOff.png";
    image_url[16] = "img/turnLightOn.png";

    for(i in image_url)
        preload_image_object.src = image_url[i];
}
