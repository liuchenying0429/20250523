let facemesh;
let video;
let predictions = [];

function setup() {
  createCanvas(640, 480).position((windowWidth - 640) / 2, (windowHeight - 480) / 2); // 產生畫布並置中
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  facemesh = ml5.facemesh(video, modelReady); // 初始化 facemesh 模型
  facemesh.on("predict", (results) => {
    predictions = results; // 儲存預測結果
  });
}

function modelReady() {
  console.log("Facemesh model loaded!");
}

function draw() {
  image(video, 0, 0, width, height); // 顯示攝影機畫面

  stroke(255, 0, 0); // 設定線條顏色為紅色
  strokeWeight(15); // 設定線條粗細為15

  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh; // 取得第一個人臉的點位資料

    // 指定的點位編號
    const indices = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];

    // 畫線連接點位
    for (let i = 0; i < indices.length - 1; i++) {
      const start = keypoints[indices[i]];
      const end = keypoints[indices[i + 1]];
      line(start[0], start[1], end[0], end[1]);
    }
  }
}
