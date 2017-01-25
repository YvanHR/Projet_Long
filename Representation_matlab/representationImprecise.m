function A = representationImprecise(fileName)

% Définition d'une figure 
figure(1)
A = imread(fileName);
info = iminfo(A);
imshow(A);
axis([0,info.Width,0,info.Height])
axis square

% Fait cliquer 10 points à l'utilisateur et stocke les coordonnées des 10 points dans la variable pts
pts = [];
while size(pts,1) ~= 10,
    [x,y] = ginput(1);
	pts = [pts ; x y];
	plot(pts(:,1),pts(:,2),'r.');
	axis([0,500,0,500])
	axis square
end

% Calcule la moyenne et la covariance des 10 points, ce qui permet de définir une gaussienne 2D
moyenne = mean(pts);
covariance = cov(pts);

% Affiche la gaussienne sous la forme d'une image en niveaux de gris (c'est plus joli !)
z = plot_gaussian_mixture(moyenne, covariance, 1,[500, 500]);
figure;
imshow(z);
hold on;

% Affiche les 10 points initiaux par dessus la gaussienne
% N.B. la fonction imshow() met l'origine en haut à gauche de la figure, ce qui explique la position des points
plot(pts(:,1),pts(:,2),'r.');

% Détermine des points sur une ellipse constituant une isovaleur de la gaussienne. L'isovaleur est caractérisée par le 3e argument, qui constitue une distance de Mahalanobis. Pour faire simple : plus cette distance est grande, plus l'ellipse sera étendue et plus la proportion d'information de la gaussienne qu'elle contiendra sera élevée.
ell = ellipse(moyenne',covariance,1);
plot(ell(1,:), ell(2,:), 'g-');

ell = ellipse(moyenne',covariance,2);
plot(ell(1,:), ell(2,:), 'b-');

ell = ellipse(moyenne',covariance,3);
plot(ell(1,:), ell(2,:), 'r-');
