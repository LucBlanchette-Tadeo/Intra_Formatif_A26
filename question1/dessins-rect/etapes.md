Étape 1 : appeler le serveur
📍 page.tsx, à la place du // TODO de la fonction du bouton

  async function NOM_FONCTION_DU_BOUTON(){
    clearShapes();
    const response = await axios.get("http://localhost:PORT/api/CONTROLEUR/ACTION");
    console.log(response.data);
    await applyEvents(response.data);
  }

NOM_FONCTION_DU_BOUTON : afficherEvents1
PORT : 5269
CONTROLEUR : Dessins
ACTION : GetDrawing1
NOM_FONCTION_EVENTS : applyEvents

----------------------------------------------------------------------------------------------

Étape 2 : la méthode récursive
📍 page.tsx, à la place du // TODO de la fonction qui reçoit (event:any)

    async function NOM_FONCTION_EVENTS(event:any){
    switch(event.PROPRIETE_TYPE){
      case "TYPE_EVENT": {
        FONCTION_QUI_DESSINE(event.propriete1, event.propriete2);
        break;
      }
    }

    if(event.LISTE_ENFANTS){
      for(let e of event.LISTE_ENFANTS){
        await NOM_FONCTION_EVENTS(e);
      }
    }
  }

NOM_FONCTION_EVENTS : applyEvents
PROPRIETE_TYPE : type
TYPE_EVENT : Square
FONCTION_QUI_DESSINE : drawSquare
propriete1, propriete2 : x, y
LISTE_ENFANTS : drawingEvents

----------------------------------------------------------------------------------------------

Étape 3 : créer un nouvel event

namespace NAMESPACE
{
    public class NOM_NOUVEL_EVENT : CLASSE_DE_BASE
    {
        public override string PROPRIETE_TYPE { get { return "TYPE_EVENT"; } }
        public TYPE_DONNEE NOM_PROPRIETE { get; set; }

        public NOM_NOUVEL_EVENT(TYPE_DONNEE nomParametre)
        {
            NOM_PROPRIETE = nomParametre;
        }
    }
}

NAMESPACE : Dessins.Events
NOM_NOUVEL_EVENT : ChangeColor
CLASSE_DE_BASE : DrawingEvent
PROPRIETE_TYPE : Type
TYPE_EVENT : ChangeColor
TYPE_DONNEE : string
NOM_PROPRIETE : Color
nomParametre : color

📍 Events/CLASSE_DE_BASE.cs, avec les autres lignes [JsonDerivedType(...)]
[JsonDerivedType(typeof(NOM_NOUVEL_EVENT))]

----------------------------------------------------------------------------------------------

Étape 4 : la séquence (serveur)
📍 Controllers/NOM_CONTROLEUR.cs, après la méthode qui existe déjà

        [HttpGet]
        public ActionResult NOM_ACTION()
        {
            var racine = new PREMIER_EVENT(...);

            racine.LISTE_ENFANTS = new List<CLASSE_DE_BASE>
            {
                new EVENT_2(...),
                new EVENT_3(...),
                new EVENT_4(...)
            };

            return Ok(racine);
        }

NOM_CONTROLEUR : DessinsController
NOM_ACTION : GetDrawing2
PREMIER_EVENT : DrawCircle(1, 1)
LISTE_ENFANTS : DrawingEvents
CLASSE_DE_BASE : DrawingEvent
EVENT_2, EVENT_3… (dans l’ordre de l’énoncé) :
Wait(3)
ChangeColor(“red”)
DrawSquare(0, 2)
DrawSquare(2, 2)
Wait(1)
ChangeColor(“yellow”)
DrawStar(1, 3, 20)

----------------------------------------------------------------------------------------------

Étape 6 : les autres case (client)
📍 page.tsx, dans le switch de applyEvents, après le premier case

      case "TYPE_FORME": {
        FONCTION_QUI_DESSINE(event.propriete1, event.propriete2);
        break;
      }
      case "TYPE_ATTENTE": {
        await FONCTION_ATTENTE(event.proprieteDuree);
        break;
      }
      case "TYPE_NOUVEL_EVENT": {
        VARIABLE_COULEUR.current = event.proprieteCouleur;
        break;
      }

TYPE_FORME : Circle
FONCTION_QUI_DESSINE : drawCircle
propriete1, propriete2 : x, y
TYPE_ATTENTE : Wait
FONCTION_ATTENTE : wait
proprieteDuree : secondes
TYPE_NOUVEL_EVENT : ChangeColor
VARIABLE_COULEUR : currentColor
proprieteCouleur : color