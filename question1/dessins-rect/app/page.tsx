"use client";

import axios from "axios";
import { useState, useRef  } from 'react';
import Canvas from './components/canvas';
import { Button } from './components/ui/button';
import { createSquare, createCircle, createStar } from '@/lib/utils';

export default function Home() {
  const [shapes, setShapes] = useState<any[]>([]);
  const currentColor = useRef("blue");

  // Seulement un exemple local pour comprendre comment dessiner des formes avec un délai
  async function afficherTestLocal(){
    clearShapes();

    await wait(1);
    
    drawSquare(1,1);
    
    await wait(2);

    currentColor.current = "red";
    drawCircle(3,1);
  }

  async function afficherEvents1(){
    clearShapes();
    const response = await axios.get("http://localhost:5269/api/Dessins/GetDrawing1");
    console.log(response.data);
    await applyEvents(response.data);
    // TODO: Il faut appeler le serveur pour obtenir l'event retourné
  }

  async function afficherEvents2(){
    clearShapes();
    // TODO: Il faut appeler le serveur pour obtenir la séquence d'événements 2 (que vous devez créer sur le serveur)
  }

  async function applyEvents(event:any){
    // TODO: Il faut traiter les événements reçus du serveur et dessiner les formes correspondantes
  }

  // ATTENTION: Les méthodes suivantes n'ont pas besoin d'être modifiées pour répondre à la question

  return (
    <div className='m-4'>
      <Button variant="outline" className="mr-2" onClick={() => afficherTestLocal()}>Afficher Test Local</Button>
      <Button variant="outline" className="mr-2" onClick={() => afficherEvents1()}>Afficher Événements 1</Button>
      <Button variant="outline" onClick={() => afficherEvents2()}>Afficher Événements 2</Button>
      <Canvas shapes={shapes} />
    </div>
  );

  function drawSquare(x :number, y:number){
    let color = currentColor.current;
    setShapes((shapes) => [...shapes, createSquare(x, y, color)]);
  }

  function drawCircle(x :number, y:number){
    let color = currentColor.current;
    setShapes((shapes) => [...shapes, createCircle(x, y, color)]);
  }

  function drawStar(x :number, y:number, innerRadius:number){
    let color = currentColor.current;
    setShapes((shapes) => [...shapes, createStar(x, y, innerRadius,color)]);
  }

  function clearShapes(){
    setShapes([]);
    currentColor.current = "blue";
  }

  async function wait(s: number){
    return new Promise(resolve => setTimeout(resolve, s * 1000));
  }
}
