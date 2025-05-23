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
  strokeWeight(2); // 設定線條粗細為15

  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh; // 取得第一個人臉的點位資料

    // 第一組點位編號
    const indices1 = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
    drawLines(keypoints, indices1);

    // 第二組點位編號
    const indices2 = [76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184];
    fillShape(keypoints, indices2);
    drawLines(keypoints, indices2);
  }
}

// 函數：根據點位編號畫線
function drawLines(keypoints, indices) {
  for (let i = 0; i < indices.length - 1; i++) {
    const start = keypoints[indices[i]];
    const end = keypoints[indices[i + 1]];
    line(start[0], start[1], end[0], end[1]);
  }
}

// 函數：填充多邊形
function fillShape(keypoints, indices) {
  fill(255, 255, 0, 150); // 設定填充顏色為半透明黃色
  noStroke(); // 移除邊框
  beginShape();
  for (let i = 0; i < indices.length; i++) {
    const point = keypoints[indices[i]];
    vertex(point[0], point[1]); // 繪製多邊形的頂點
  }
  endShape(CLOSE);
}
