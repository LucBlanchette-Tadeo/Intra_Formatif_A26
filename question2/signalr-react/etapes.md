Étape 1 : se connecter au Hub (client)
📍 page.tsx, fonction connectToHub, à la place du // TODO et du setIsConnected(true) qui était déjà là

  function NOM_FONCTION_CONNEXION() {
    let newHubConnection = new HubConnectionBuilder()
    .withUrl('http://localhost:PORT/CHEMIN_HUB')
    .build();

    // les .on(...) iront ici

    newHubConnection
    .start()
    .then(() => {
      SET_IS_CONNECTED(true);
    })
    .catch((err: any) => console.log("Erreur de connexion: " + err));

    SET_HUB_CONNECTION(newHubConnection);
  }


NOM_FONCTION_CONNEXION : connectToHub
PORT : 5282
CHEMIN_HUB : hubs/pizza
SET_IS_CONNECTED : setIsConnected
SET_HUB_CONNECTION : setHubConnection

-------------------------------------------------------------------------------------------------------------

Étape 2 : connexion et déconnexion (serveur)
📍 Hubs/NOM_HUB.cs, les méthodes OnConnectedAsync et OnDisconnectedAsync

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            _MANAGER.METHODE_AJOUT();
            await Clients.All.SendAsync("NOM_MESSAGE", _MANAGER.PROPRIETE_NB);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            _MANAGER.METHODE_RETRAIT();
            await Clients.All.SendAsync("NOM_MESSAGE", _MANAGER.PROPRIETE_NB);
            await base.OnDisconnectedAsync(exception);
        }

NOM_HUB : PizzaHub
_MANAGER : _pizzaManager
METHODE_AJOUT : AddUser
METHODE_RETRAIT : RemoveUser
NOM_MESSAGE : UpdateNbUsers
PROPRIETE_NB : NbConnectedUsers (sans ())

⚠️ Le piège : OnDisconnectedAsync contenait base.OnConnectedAsync().

-------------------------------------------------------------------------------------------------------------

Étape 3 : écouter le message (client)
📍 page.tsx, dans connectToHub, à la place de // les .on(...) iront ici

    newHubConnection.on("NOM_MESSAGE", (valeur: number) => {
      SET_STATE(valeur);
    });

NOM_MESSAGE : UpdateNbUsers
SET_STATE : setUserCount

-------------------------------------------------------------------------------------------------------------

Étape 4 : choisir une pizza (serveur)
📍 Hubs/PizzaHub.cs

csharp
        public async Task SelectChoice(PizzaChoice choice)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, _pizzaManager.GetGroupName(choice));
            await Clients.Caller.SendAsync("UpdatePizzaPrice", _pizzaManager.GetPizzaPrice(choice));
            await Clients.Caller.SendAsync("UpdateNbPizzasAndMoney", _pizzaManager.GetNbPizzas(choice), _pizzaManager.GetMoney(choice));
        }

-------------------------------------------------------------------------------------------------------------

Étape 5 : choisir une pizza (client)
📍 page.tsx

ts
  function selectChoice(selectedChoice:number) {
    setSelectedChoice(selectedChoice);
    hubConnection?.invoke("SelectChoice", selectedChoice);
  }

📍 page.tsx, dans connectToHub, avant .start()

ts
    newHubConnection.on("UpdatePizzaPrice", (price: number) => {
      setPizzaPrice(price);
    });

    newHubConnection.on("UpdateNbPizzasAndMoney", (nbPizzas: number, money: number) => {
      setNbPizzas(nbPizzas);
      setMoney(money);
    });

-------------------------------------------------------------------------------------------------------------

Étape 6 : changer de pizza
📍 Hubs/PizzaHub.cs

csharp
        public async Task UnselectChoice(PizzaChoice choice)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, _pizzaManager.GetGroupName(choice));
        }

📍 page.tsx

ts
  function unselectChoice() {
    hubConnection?.invoke("UnselectChoice", selectedChoice);
    setSelectedChoice(-1);
  }

-------------------------------------------------------------------------------------------------------------

Étape 7 : ajouter 2 $
📍 Hubs/PizzaHub.cs

csharp
        public async Task AddMoney(PizzaChoice choice)
        {
            _pizzaManager.IncreaseMoney(choice);
            await Clients.Group(_pizzaManager.GetGroupName(choice)).SendAsync("UpdateMoney", _pizzaManager.GetMoney(choice));
        }

📍 page.tsx

ts
  function addMoney() {
    hubConnection?.invoke("AddMoney", selectedChoice);
  }

📍 page.tsx, dans connectToHub, avant .start()

ts
    newHubConnection.on("UpdateMoney", (money: number) => {
      setMoney(money);
    });

-------------------------------------------------------------------------------------------------------------

Étape 8 : acheter une pizza
📍 Hubs/PizzaHub.cs

csharp
        public async Task BuyPizza(PizzaChoice choice)
        {
            _pizzaManager.BuyPizza(choice);
            await Clients.Group(_pizzaManager.GetGroupName(choice)).SendAsync("UpdateNbPizzasAndMoney", _pizzaManager.GetNbPizzas(choice), _pizzaManager.GetMoney(choice));
        }

📍 page.tsx

ts
  function buyPizza() {
    hubConnection?.invoke("BuyPizza", selectedChoice);
  }