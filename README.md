
                        # BattlePoc
                    Game Concours Babylonjs

Créateurs:
Matthis Kuhl, Ahmed El Hanafi Si Dehbi

![Screenshot](readmeimage/menu.png)

Concept de jeu:

Le jeu s'inspire du monde pokemon, il est mode un joueuer et vous étez pikatchu.
Vous devez vous battre contre les autres pokemons et sur tous contre le redutable pokemon boss Mewtwo.
La map est générer aléatoirement avec un algorithme reliant les salles positioner au hasard avec des chemins.
Il y a plusieurs enemie qu'on peut retrouver dans les salles.
Les salles ce recharge à chaque fois que vous y entrer de dans.
Vous gagnez des experiance et donc des niveaux pour chaque victoir sur un pokemon.
De plus la difficulté des salles augemante avec le gain de niveau.

L'histoire:

Nous jouant dans un monde ou Miewtwoo à décidé de faire disparaitre tous les humain sur terre et de les éffacés de la mémoires des pokemons. Picatchu est le dernier à avoir des souvenirs et ce met à la concete pour le retour des Humains.
Bien que les autres pokemons et leurs environement vont rendre cette conquete difficile arrivera-t-il à c'est fin?
C'est à vous de sauver ce monde.

Réggle de jeut:
Il ne faut pas résté dans l'eau si non on perdra vite connaisance.
Le but est de battre les autres pokemons affin de gagner en experiance puis battre le boss mewtwo qui ce trouve à l'autre coté de la map.


Lien video d'un montage de game play du jeut :
https://youtu.be/gvQq46K9cbI

lien d'ébergement du jeu:
https://kuhlmatthis.github.io/BattlePoK/


Menu:

Le menu est une interface babylonjs scene rendered au debut on peut appuiez sur:

Play pour demare la vidéo est puis jouer par la suite
Replay pour lancé une partie sans vidéo 
Informations pour obtenir les information de jeu nécéssaire.
Quit: pour sortir du jeu.

Si on jeut est lancé à la touche p on reviens sur la scene du menu et avec play on continue le jeu, replay on lance un nouveau jeu.

Creation de la map:

On a définis en careau 50 50 qui est la map de notre jeu.
Chaque salle est un rectange fix à une position x et y de longeure 20.
Pour positioner:
tant que existe salle à placer:
On prend un point au hasard dans la map et on verrifie qu'il ne ce croise pas avec une salle déjà existant.
en fonction du résultat présenedant en rajoute la salle et en diminue les salles à creer ou si non en continue à boucler.

Pour creer les chemin on connecte salle 0 à salle 1 puis salle 1 à salle 2 etc
Pour chaque salle en à definis le point de départ et d'arriver juste devant la porte par la suite on peut calculer le mouvement nécéssaire pour le chemin: position x de la salle 1 - position x de la salle 2 et position y de la salle 2 - position y de la salle 2
On va boucler sur c'est valeur et à chaque fois creer les box à la position actuelle puis reduer les valeur.
Si les valeurs sont à 0 0 on est arrivé chez l'autre salle.

Difficulté: en peut passez à travers des salles entre le point de départ et d'arriver.
La solution n'est pas si compliqué grace à la forme d'une salle rectangulaire. Si jamais en croise une salle:
on allange sur les mures droites ou gauche j'usqu'au bout puis en avance de un.
Il faut pas oublié d'incrémenter les valeurs en fonction affin de prendre en compte qu'on reprend de la distance et revenir dans l'autre sense plus tard.

Generer aléatoirement de la map étais compliqué sur tous qu'on travaillé avec plusieurs boucle while non trivial pour positionnement les salles et creer les chemins.
Donc fallais comprendre pourquoi ca bouclé souvant à l'invinis et donc plante la page web.

Exterieure:
![Screenshot](readmeimage/exterieure.png)

Pour rendre l'exterieure plus intérrésant on a positioner des enemie au assard sur la map. Un pokemon d'eaux et un volant.
Il fallais vérifié que la création ne ce fessait pas sur le chemin en lui même risque que c'est enemi sont stocker dans les mures ou que les pokemon d'eau se trouve sur la surface.
Pour des résultats propre on as découpé la map dans des zones ou en générais un ennemi soit volant soit nagant.
Dans cette zone en choisis une position au hasard et on verifie grace à un ray cast qu'il n'y a pas de colision avec un chemin.

Deux problemes sont que dans les salles le sol n'est pas encore généré donc l'enemie peut se retrouver de dans et que juste le sol classique et verifier non le sole sous forme lave.

Il y a des particules fummés devant l'entree qui disparaise et reapparaise lors de l'entrée sortis de la salle.
Plus concrétement j'ai une box de la taile de salle avec alpha = 0 donc invisible.
Cette box a un actionmanager qui trigger lors de l'entrée ou sortis de cette box et donc va executer plusieur chose:
1: desactive ou active le systeme de particule devant l'entrée.
2: desactive ou active le systeme de particule de la plui sur picatchu (suite)
3: disable tous les enemies éxtérieure
4: genere le sol et ellement d'environnement et ennemie de la salle (suite)




Salle et Ennemi:
![Screenshot](readmeimage/fullsale.png)






Lumiere:
![Screenshot](readmeimage/fireandlight.png)


Mesh et video:
![Screenshot](readmeimage/blender.png)

Boss:
![Screenshot](readmeimage/Boss.png)


Pour les meshes une partie et récuperer sur internet cgtrader.com/ puis souvent repain  puis skeletisé et animé en blender par nous meme.*
Puis exporté.
Les points les plus difficile etais la lumiere les exportation importation les chutes de frames à cause de beaucoup de mesh donc il fallais rechargé les salles et deschargé les enemis etc.