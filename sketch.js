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
    fillShape(keypoints, indices2, [255, 255, 0, 150]); // 填充黃色
    drawLines(keypoints, indices2);

    // 填充第一組與第二組之間的區域
    fillBetweenShapes(keypoints, indices1, indices2);

    // 第三組點位編號（紫色線條）
    const indices3 = [243, 190, 56, 28, 27, 29, 30, 247, 130, 25, 110, 24, 23, 22, 26, 112];
    drawPurpleLines(keypoints, indices3);

    // 第四組點位編號
    const indices4 = [133, 173, 157, 158, 159, 160, 161, 246, 33, 7, 163, 144, 145, 153, 154, 155];
    fillShape(keypoints, indices4, [0, 0, 255, 150]); // 填充藍色
    drawLines(keypoints, indices4); // 繪製第四組點位的連線

    // 填充第三組與第四組之間的區域
    fillBetweenShapes(keypoints, indices3, indices4, [173, 216, 230, 150]); // 填充淺藍色

    // 第五組點位編號（綠色線條）
    const indices5 = [359, 467, 260, 259, 257, 258, 286, 414, 463, 341, 256, 252, 253, 254, 339, 255];
    fillShape(keypoints, indices5, [255, 165, 0, 150]); // 填充橘色
    drawGreenLines(keypoints, indices5);
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
function fillShape(keypoints, indices, color) {
  fill(...color); // 設定填充顏色
  noStroke(); // 移除邊框
  beginShape();
  for (let i = 0; i < indices.length; i++) {
    const point = keypoints[indices[i]];
    vertex(point[0], point[1]); // 繪製多邊形的頂點
  }
  endShape(CLOSE);
}

// 函數：填充第一組與第二組之間的區域（更新以支持自定義顏色）
function fillBetweenShapes(keypoints, indices1, indices2, color = [50, 50, 50, 200]) {
  fill(...color); // 設定填充顏色
  noStroke(); // 移除邊框
  beginShape();
  // 繪製第一組點位
  for (let i = 0; i < indices1.length; i++) {
    const point = keypoints[indices1[i]];
    vertex(point[0], point[1]);
  }
  // 繪製第二組點位（反向）
  for (let i = indices2.length - 1; i >= 0; i--) {
    const point = keypoints[indices2[i]];
    vertex(point[0], point[1]);
  }
  endShape(CLOSE);
}

// 函數：繪製紫色線條
function drawPurpleLines(keypoints, indices) {
  stroke(128, 0, 128); // 設定線條顏色為紫色
  strokeWeight(5); // 設定線條粗細為5
  for (let i = 0; i < indices.length - 1; i++) {
    const start = keypoints[indices[i]];
    const end = keypoints[indices[i + 1]];
    line(start[0], start[1], end[0], end[1]);
  }
}

// 函數：繪製綠色線條
function drawGreenLines(keypoints, indices) {
  stroke(0, 255, 0); // 設定線條顏色為綠色
  strokeWeight(5); // 設定線條粗細為10
  for (let i = 0; i < indices.length - 1; i++) {
    const start = keypoints[indices[i]];
    const end = keypoints[indices[i + 1]];
    line(start[0], start[1], end[0], end[1]);
  }
}
