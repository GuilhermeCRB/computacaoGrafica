class Canvas {
  canvas: HTMLCanvasElement | null;
  context: CanvasRenderingContext2D | null | undefined;
  points: any[];
  canDraw: boolean;
  strokeStyle: string;
  lineWidth: number;

  constructor(){
    this.canvas = document.querySelector("canvas");
    this.context = this.canvas?.getContext("2d");
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

  savePoint(x: number, y: number, dragging: any) {
    const area = this.canvas?.getBoundingClientRect();
    const point = { x: x - area.left, y: y - area.top, dragging };
    this.points.push(point);
  }

  draw() {
    this.configContextForDrawing();
  
    for (var i = 0; i < this.points.length; i++) {
      this.context?.beginPath();
      const point = this.points[i];
      if (point.dragging && i > 0) {
        const previousPoint = this.points[i - 1];
        this.context?.moveTo(previousPoint.x, previousPoint.y);
      } else {
        this.context?.moveTo(point.x - 1, point.y);
      }
      this.context?.lineTo(point.x, point.y);
      this.context?.closePath();
      this.context?.stroke();
    }
  }

  clean() {
    this.context?.clearRect(0, 0, this.context?.canvas.width, this.context?.canvas.height);
    this.context?.fillStyle = "white";
    this.context?.fillRect(0, 0, this.context?.canvas.width, this.context?.canvas.height);
    this.points = [];
  }

  configContextForDrawing() {
    this.context?.fillStyle = "white";
    this.context?.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    this.context?.strokeStyle = this.strokeStyle;
    this.context?.lineJoin = "round";
    this.context?.lineWidth = this.lineWidth;
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

const canvas = new Canvas;
canvas.configContextForDrawing();