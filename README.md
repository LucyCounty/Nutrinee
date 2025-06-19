# Nutrinee

  1 - O que é o Nutrinee?

Nutrinee é um site focado em Nutrição com personal trainee, nele guarda todas as suas informações como peso, caminhadas realizadas e afins além de te ajudar nas suas comparações diárias e semanais através de gráficos.

  2 - Como funciona o site?

Sobre a utilização do site está tudo explicado no vídeo chamado "Nutrinee site.mp4" ou pelo vídeo no youtube: https://youtu.be/uO27EgjoJuo

3 - O que precisa para fazer ele funcionar?

Você precisa do drive do mongodb, então caso você não possua, dentro do cmd digite:

- npm install mongodb

4 - Como abrir o site?

Para abrir o site, você precisa criar um arquivo chamado ".env" dentro da pasta "Nutrinee", dentro dele você vai colocar:

- ATLAS_URI=""
- PORT=

Em "ATLAS_URI" você vai colocar em qual cluster do MongoDB Atlas ele vai se conectar e em "PORT" você vai colocar em qual porta ele irá funcionar.

  5 - Como habilitar o backend?

Abra um no prompt de comando e certifique-se de que você esteja dentro da pasta "Nutrinee", e então digite:

- npm install
- npm run dev

6 - Como habilitar o frontend?

Abra um no prompt de comando e certifique-se de que você esteja dentro da pasta "Nutrinee", e então digite:

- cd frontend
- npm install --force 
- npm run dev

Aviso importante: Importante colocar --force, se não a instalação dentro de "frontend" não irá funcionar.
