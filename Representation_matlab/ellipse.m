function uv = ellipse(pm,Sig,k)

  Lp = inv(Sig);
  [X,D] = eig(Lp);
  j=1;
  for the=0:pi/20:2*pi;
     pq=[cos(the)*sqrt(k/D(1,1));sin(the)*sqrt(k/D(2,2))];
     uv(:,j)=X*pq+pm;
     j=j+1;
  end
  umin=min(uv(1,:));
  vmin=min(uv(2,:));
  umax=max(uv(1,:));
  vmax=max(uv(2,:));
  wi=umax-umin;
  he=vmax-vmin;
  

