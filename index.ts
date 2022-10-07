configContextForDrawing();

class Canvas {
  canvas: HTMLCanvasElement | null;
  context: CanvasRenderingContext2D | null | undefined;
  points: any[];
  canDraw: boolean;
  strokeStyle: string;
  lineWidth: number;

  constructor(
    canvas: HTMLCanvasElement, 
    context: CanvasRenderingContext2D, 
    points: any[], 
    canDraw: boolean, 
    strokeStyle: string, 
    lineWidth: number
    ){
    this.canvas = document.querySelector("canvas");
    this.context = canvas?.getContext("2d");
    this.points = [];
    this.canDraw = false;
    this.strokeStyle = "#000";
    this.lineWidth = 5;
  }

  initiatesDrawing(){
    this.canvas?.addEventListener('mousedown', ({ clientX, clientY }) => {
      this.canDraw = true;
      savePoint(clientX, clientY, false);
      draw();
    });
  }
  
  doDrawing(){
    this.canvas?.addEventListener('mousemove', ({ clientX, clientY }) => {
      if (this.canDraw) {
        savePoint(clientX, clientY, true);
        draw();
      }
    });
  }

  stopDrawing(){
    this.canvas?.addEventListener('mouseup', (e) => { this.canDraw = false });
    this.canvas?.addEventListener('mouseleave', (e) => { this.canDraw = false });
  }
}

/* ****** ELEMENTS ****** */

class SaveButton {
  private button: Element | null;
  constructor(button: Element){
    this.button = document.querySelector(".save");
  }

  click(canvas: HTMLCanvasElement){
    this.button?.addEventListener("click", (e) => {
      const image = canvas.toDataURL('image/png');
      const a = document.createElement("a");
      a.href = image;
      a.download = "canvas.png";
      a.click();
      document.body.append(a);
      document.body.removeChild(a);
    });
  }
}

class DeleteButton {
  private button: Element | null
  constructor(button: Element){
    this.button = document.querySelector(".delete");
  }

  click(context: CanvasRenderingContext2D){
    this.button?.addEventListener("click", (e) => { clean() })
  }
}

class StrokeInput {
  private input: Element | null;
  constructor(input: Element){
    this.input = document.querySelector("#stroke");
  }

  setStroke(){
    this.input?.addEventListener("change", (e) => {
      const lineWidth = e.target?.value;
      draw();
    });
  }
}

/* ****** FUNCTIONS ****** */

function savePoint(x, y, dragging) {
  const area = canvas.getBoundingClientRect();
  const point = { x: x - area.left, y: y - area.top, dragging };
  points.push(point);
}

function draw() {
  configContextForDrawing();

  for (var i = 0; i < points.length; i++) {
    context.beginPath();
    const point = points[i];
    if (point.dragging && i > 0) {
      const previousPoint = points[i - 1];
      context.moveTo(previousPoint.x, previousPoint.y);
    } else {
      context.moveTo(point.x - 1, point.y);
    }
    context.lineTo(point.x, point.y);
    context.closePath();
    context.stroke();
  }
}

function configContextForDrawing() {
  context.fillStyle = "white";
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  context.strokeStyle = strokeStyle;
  context.lineJoin = "round";
  context.lineWidth = lineWidth;
}

function clean() {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.fillStyle = "white";
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  points = [];
}