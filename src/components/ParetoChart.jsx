import { useRef, useMemo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import '../styles/ParetoChart.css'

// 한반도 SVG path (korea.svg에서 추출)
const KOREA_SVG_PATH = "M369.156 0.0344994C371.692 1.98372 374.495 3.55344 377.618 4.13131C380.301 4.63155 380.758 6.04603 380.551 8.36612C380.309 11.1002 380.792 13.7912 381.155 16.508C382.043 23.2009 385.83 27.3063 392.205 28.7294C397.217 29.8507 400.434 32.5589 402.056 37.3112C403.729 42.2446 408.275 45.108 410.786 49.4981C412.062 51.7405 412.166 53.2413 410.829 55.3285C406.593 61.9179 403.721 63.2547 396.113 61.8058C389.695 60.581 386.322 62.1594 383.725 68.076C382.259 71.4139 379.533 72.7162 376.376 73.389C372.089 74.2946 369.993 76.6923 368.837 81.0392C365.688 92.8898 360.435 103.654 350.515 111.511C348.117 113.408 347.314 115.849 347.866 118.782C348.807 123.75 349.281 128.424 354.396 131.935C360.297 135.988 360.443 141.543 355.69 147.261C351.722 152.039 351.317 156.843 352.956 162.501C355.734 172.1 353.154 180.044 344.123 183.761C332.331 188.617 323.144 196.483 314.017 204.832C310.213 208.308 305.357 210.723 301.915 214.474C298.102 218.623 293.832 220.598 288.441 221.4C285.154 221.892 284.024 224.954 283.93 227.99C283.757 233.51 280.91 236.64 275.855 238.391C271.991 239.728 268.333 241.488 268.161 246.542C268.101 248.232 266.531 248.758 265.142 249.224C261.95 250.294 258.646 250.552 255.342 250.19C247.079 249.276 240.531 252.622 234.804 258.159C233.251 259.66 231.819 261.428 229.714 262.058C225.539 263.317 222.684 265.594 221.752 270.122C221.235 272.649 218.647 272.865 216.646 273.529C213.488 274.581 212.462 276.401 214.273 279.385C216.111 282.404 215.912 285.362 214.179 288.355C210.78 294.229 211.599 299.61 216.145 304.544C217.318 305.82 218.379 307.183 218.819 308.917C219.82 312.841 217.94 315.808 213.937 316.481C212.807 316.67 211.642 316.584 210.495 316.679C209.037 316.8 207.303 316.955 207.416 318.887C207.554 321.164 209.141 321.078 210.892 320.491C211.513 320.284 212.393 320.302 212.979 320.586C220.251 324.122 228.377 326.175 233.173 333.765C235.822 337.957 239.082 341.941 244.206 343.606C244.698 343.77 245.259 344.253 245.466 344.719C248.191 351.006 254.152 353.697 259.371 357.156C262.373 359.139 264.641 361.641 265.832 364.987C270.964 379.494 278.254 393.052 284.43 407.102C289.468 418.556 296.662 428.854 304.589 438.566C309.549 444.638 313.293 451.339 315.881 458.774C317.744 464.138 321.574 468.416 324.999 472.806C331.028 480.551 335.591 488.831 336.877 498.715C337.852 506.262 340.25 513.533 340.957 521.166C341.423 526.211 340.879 530.903 339.12 535.509C337.541 539.623 336.998 543.841 337.239 548.196C337.299 549.335 337.11 550.853 337.739 551.543C341.802 555.984 338.964 559.176 336.109 562.531C333.633 565.437 333.487 568.439 336.135 571.432C338.93 574.606 339.473 578.004 336.911 581.626C336.428 582.308 335.695 583.136 336.653 583.877C337.688 584.688 338.576 583.92 339.24 583.161C340.56 581.652 341.638 579.901 343.096 578.547C344.865 576.9 346.762 576.762 346.719 579.832C346.616 587.612 347.849 595.564 342.743 602.636C340.586 605.621 340.051 609.553 339.887 613.348C339.698 617.583 338.688 620.981 334.988 624.155C331.391 627.234 329.76 632.694 329.812 637.464C329.881 643.863 326.137 647.279 321.807 650.246C318.141 652.755 314.854 655.162 313.5 659.655C312.758 662.131 311.456 662.312 309.566 660.181C305.728 655.86 297.8 655.11 293.047 658.318C291.926 659.077 291.037 660.035 290.848 661.38C290.485 663.925 289.321 665.848 287.302 667.521C285.215 669.255 285.681 671.575 286.716 673.843C289.718 680.424 287.63 684.34 280.462 685.573C277.149 686.142 273.639 685.573 271.042 688.825C269.912 690.239 269.127 688.342 269.153 687.281C269.274 682.641 266.341 680.053 263.106 677.474C260.742 675.594 258.879 675.542 257.715 678.466C256.429 681.7 254.1 682.641 250.891 682.347C247.303 682.02 245.121 683.331 244.896 687.289C244.775 689.394 243.326 690.679 241.204 690.851C237.849 691.119 235.183 692.87 232.846 694.966C228.722 698.657 224.418 699.192 219.302 697.217C211.651 694.258 209.926 694.983 204.552 701.296C201.869 704.453 199.523 707.929 196.02 710.378C193.036 712.457 190.181 711.991 186.721 711.629C180.502 710.982 179.846 707.972 181.071 703.03C181.261 702.245 181.296 701.175 180.433 700.692C179.312 700.08 178.535 701.037 177.819 701.684C175.482 703.797 173.101 705.876 171.419 708.636C168.201 713.914 163.707 716.562 157.341 715.251C154.296 714.622 151.898 715.346 149.827 718.037C146.843 721.918 142.047 721.953 137.69 722.686C136.621 722.867 135.689 722.22 135.189 721.297C132.549 716.485 127.839 716.26 123.233 715.967C120.499 715.795 118.006 715.967 116.306 712.888C115.357 711.172 113.02 710.24 110.777 709.912C105.144 709.084 103.816 706.816 106.041 701.546C108.353 696.078 111.571 691.145 115.754 686.893C117.367 685.254 119.162 683.814 120.844 682.244C123.104 680.131 124.829 677.733 125.079 674.499C125.157 673.507 125.269 672.42 125.717 671.566C129.099 665.218 128.952 659.077 125.485 652.73C123.19 648.538 124.596 644.329 126.934 640.474C127.598 639.37 128.34 638.266 129.254 637.369C134.827 631.84 137.104 625.682 135.568 617.523C134.068 609.571 135.888 607.561 143.177 604.189C144.22 603.706 145.238 603.171 146.282 602.688C148.18 601.817 149.224 600.739 147.274 598.876C144.962 596.668 145.307 594.684 147.671 592.752C148.318 592.218 148.775 591.433 149.284 590.743C152.89 585.809 152.683 584.886 147.498 581.764C146.023 580.876 144.6 579.893 143.263 578.823C142.219 577.995 141.081 576.331 141.615 575.511C146.041 568.663 138.769 562.186 141.15 555.484C141.244 555.226 141.313 554.863 141.21 554.639C138.579 549.188 138.95 543.66 140.451 537.976C140.917 536.216 139.649 534.578 137.82 533.991C135.637 533.301 135.292 535.311 134.542 536.604C134.111 537.346 133.783 538.148 133.36 538.907C132.765 539.977 131.911 540.71 130.6 540.615C129.159 540.512 128.745 539.442 128.521 538.252C127.883 534.828 125.407 533.672 122.336 533.249C115.901 532.361 113.132 527.005 116.772 521.597C119.515 517.526 122.138 513.559 123.664 508.815C124.544 506.064 126.977 504.46 130.065 504.589C134.231 504.753 137.665 503.761 139.899 499.819C141.15 497.62 143.341 497.611 145.627 498.276C148.818 499.207 152.088 499.759 155.417 499.086C159.937 498.172 161.179 495.783 159.541 491.583C159.049 490.315 158.471 489.53 157.039 490.03C155.176 490.694 153.304 491.134 152.036 489.125C150.725 487.037 150.388 484.709 151.975 482.647C153.994 480.025 153.252 478.016 150.733 476.601C146.412 474.169 146.075 470.383 146.843 466.174C147.127 464.63 147.705 463.138 148.154 461.62C149.819 456.022 148.732 454.22 143.013 453.668C138.726 453.254 135.508 451.184 132.722 448.027C129.979 444.922 127.296 441.541 122.569 441.429C115.547 441.265 112.528 436.582 110.846 430.743C110.087 428.104 109.224 426.517 106.188 427.345C104.005 427.94 102.642 426.646 101.478 425.094C100.262 423.481 99.0626 421.859 97.2339 420.876C96.216 420.333 94.2924 419.522 94.1026 420.083C92.6965 424.266 87.1499 424.973 86.3736 429.449C85.925 432.062 85.3384 433.891 82.3538 431.821C80.3611 430.441 79.8953 432.157 79.1535 433.296C76.7813 436.936 73.7276 439.583 69.2679 440.282C68.1034 440.463 66.7922 440.756 66.3092 439.359C65.8433 438.005 67.0424 437.324 68.0258 436.729C68.5088 436.435 69.104 436.306 69.5957 436.021C70.8896 435.28 73.1669 434.857 72.244 432.847C71.2174 430.596 69.1903 431.39 67.4133 432.33C66.404 432.865 65.3517 433.373 64.2561 433.658C63.1347 433.943 61.884 433.917 61.1766 432.752C60.5038 431.648 61.2629 430.829 62.0133 430.148C64.351 428.017 62.7034 426.957 60.8919 426.034C59.1495 425.137 57.269 425.232 55.4057 425.628C53.137 426.111 50.8339 426.292 48.5479 425.947C46.0205 425.568 44.3988 424.128 43.9675 421.506C43.5189 418.789 44.9077 417.305 47.1505 416.037C49.1 414.934 53.0853 415.555 52.5936 412.337C52.007 408.508 48.5824 411.406 46.4863 410.957C45.6495 410.776 44.5627 410.845 44.0278 410.336C40.241 406.792 36.1177 407.87 31.9254 409.232C29.3634 410.069 26.8187 409.897 24.3085 409.008C23.1267 408.594 21.4877 408.482 21.4273 406.869C21.3756 405.463 22.6523 404.566 23.8082 404.049C25.7577 403.169 27.8452 402.591 29.8551 401.832C33.9956 400.288 34.9445 398.391 33.6678 394.208C33.3314 393.113 32.4257 391.81 33.2193 390.931C36.6439 387.136 36.4455 381.279 39.249 377.967C43.6569 372.775 46.2448 368.428 44.1572 361.442C43.1738 358.147 46.7019 356.552 49.8505 356.621C51.9553 356.673 54.0514 357.457 56.1303 358.009C57.5191 358.372 58.8303 359.105 60.2277 359.312C63.0312 359.717 66.3437 359.648 67.1114 356.535C67.8187 353.68 64.1267 352.705 62.4447 352.584C57.7779 352.239 55.7421 349.712 54.2239 345.797C52.6108 341.657 54.0687 338.034 55.9492 334.696C59.3134 328.737 64.0664 323.553 65.4379 316.489C65.8175 314.54 68.0603 313.988 69.7165 313.152C73.3395 311.34 74.0468 308.813 71.3468 305.976C69.4405 303.975 69.9408 301.991 70.7085 300.007C71.7781 297.239 71.1571 294.832 69.4059 292.762C66.9044 289.804 64.1699 287.044 61.4871 284.25C60.5469 283.266 59.253 282.982 57.9245 282.956C54.9658 282.895 51.8863 283.456 49.8591 280.239C49.4537 279.592 47.7371 279.618 46.6157 279.592C44.002 279.515 42.4234 278.876 41.1812 275.97C39.7234 272.58 35.833 271.468 32.1928 271.079C30.7177 270.924 29.9672 272.227 29.5877 273.546C29.1909 274.926 28.889 276.332 28.5008 277.721C28.1212 279.057 27.3966 280.196 25.8439 280.067C24.1014 279.929 24.9468 278.35 24.5328 277.47C22.8852 273.977 22.566 270.614 23.696 266.845C24.3775 264.585 22.2209 264.033 20.375 264.05C17.2609 264.085 14.1469 264.645 13.4827 260.04C13.267 258.504 11.0501 257.09 9.37662 257.461C6.22808 258.168 3.07953 257.133 0 257.901C0 256.46 0 255.029 0 253.588C0.422681 253.191 0.776353 252.665 1.26804 252.424C5.33958 250.449 7.57375 247.663 6.28846 242.79C5.77089 240.858 7.09069 239.236 8.39324 237.822C10.6533 235.364 13.3619 233.458 16.1913 231.75C18.7187 230.232 21.0909 228.429 22.1951 225.739C24.3947 220.417 28.8286 217.64 33.4177 214.94C37.3339 212.629 41.7764 211.145 44.5282 207.083C45.5029 205.651 47.4697 205.367 49.2121 205.177C54.06 204.633 58.1143 202.408 62.2031 199.838C71.2951 194.111 80.0937 187.789 90.5486 184.52C93.3176 183.658 95.9313 182.123 97.4237 179.57C98.6744 177.422 100.305 176.741 102.608 176.465C110.285 175.533 116.22 172.101 119.015 164.433C119.412 163.338 120.033 162.354 121.042 161.716C129.936 156.153 134.87 147.382 139.813 138.619C141.012 136.497 141.969 134.272 143.936 132.642C149.776 127.82 150.397 125.44 147.818 118.523C144.453 109.493 146.869 105.844 156.659 105.197C157.522 105.137 158.385 105.111 159.247 105.146C162.12 105.258 164.294 104.68 166.045 101.799C168.503 97.7542 172.773 97.9871 175.585 101.842C176.379 102.929 177.267 103.843 178.509 104.283C181.925 105.482 183.711 108.087 185.057 111.261C186.618 114.926 188.973 118.048 192.829 119.497C194.959 120.3 196.59 121.438 197.797 123.353C199.859 126.639 202.792 127.484 206.346 126.061C209.848 124.655 212.893 125.242 216.085 127.303C220.208 129.968 224.737 131.857 229.809 131.917C231.517 131.935 233.26 132.193 234.588 130.632C237.21 127.562 239.841 128.579 242.481 130.684C248.183 135.229 248.329 135.221 254.342 131.081C262.554 125.423 262.657 119.058 255.446 112.606C248.787 106.646 245.284 98.7892 245.086 89.7244C245.034 87.4561 245.086 84.3167 247.13 83.4283C253.488 80.6597 260.63 77.1666 267.005 78.3655C272.224 79.3487 276.942 80.608 282.17 79.3056C283.093 79.0727 284.171 79.3315 285.163 79.4867C297.119 81.3756 312.223 72.6731 316.743 61.3573C318.287 57.4933 319.236 53.3879 321.401 49.7741C323.765 45.8325 325.801 45.2805 329.26 48.0577C331.322 49.7137 333.012 49.7396 334.988 48.144C336.256 47.1176 337.748 46.4621 339.387 47.247C342.216 48.6011 344.658 48.1181 346.849 45.9274C349.135 43.6418 348.203 41.2268 347.28 38.7343C346.426 36.4228 345.477 33.9561 347.987 32.0586C351.334 29.5229 351.705 26.0557 352.024 22.1659C352.706 13.8343 353.663 5.40779 361.435 0H369.199L369.156 0.0344994Z"

// SVG path를 포인트 배열로 샘플링
function samplePathPoints(pathString, numPoints = 300) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', pathString)
  svg.appendChild(path)
  document.body.appendChild(svg)
  
  const pathLength = path.getTotalLength()
  const points = []
  
  for (let i = 0; i < numPoints; i++) {
    const distance = (i / (numPoints - 1)) * pathLength
    const point = path.getPointAtLength(distance)
    points.push({ x: point.x, y: point.y })
  }
  
  document.body.removeChild(svg)
  return points
}

// 포인트 배열을 SVG path로 변환
function pointsToPath(points) {
  if (points.length === 0) return ''
  
  let path = `M ${points[0].x},${points[0].y} `
  
  for (let i = 1; i < points.length; i++) {
    path += `L ${points[i].x},${points[i].y} `
  }
  
  path += 'Z'
  return path
}

// 두 포인트 간 거리 계산
function distance(p1, p2) {
  const dx = p1.x - p2.x
  const dy = p1.y - p2.y
  return Math.sqrt(dx * dx + dy * dy)
}

// 두 도형의 포인트를 최단 거리로 재배열
function optimizePointOrder(sourcePoints, targetPoints) {
  // targetPoints의 시작점을 최적화하여 sourcePoints와 최단 거리로 매칭
  let minTotalDistance = Infinity
  let bestOffset = 0
  
  // 모든 가능한 시작점을 시도
  for (let offset = 0; offset < targetPoints.length; offset += Math.floor(targetPoints.length / 20)) {
    let totalDistance = 0
    
    // 이 offset에서의 전체 거리 계산
    for (let i = 0; i < sourcePoints.length; i++) {
      const targetIndex = (i + offset) % targetPoints.length
      totalDistance += distance(sourcePoints[i], targetPoints[targetIndex])
    }
    
    if (totalDistance < minTotalDistance) {
      minTotalDistance = totalDistance
      bestOffset = offset
    }
  }
  
  // 최적 offset으로 targetPoints 재배열
  const optimizedPoints = []
  for (let i = 0; i < targetPoints.length; i++) {
    const targetIndex = (i + bestOffset) % targetPoints.length
    optimizedPoints.push(targetPoints[targetIndex])
  }
  
  return optimizedPoints
}

// Pareto 영역을 SVG path로 생성하는 함수
function createParetoPath(data, width, height, padding) {
  // 전체 급제자 수 (본관별_급제자수.csv의 전체 합계)
  const TOTAL_GWAGEO = 15151
  const maxCount = Math.max(...data.map(d => d.count))

  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom
  const barWidth = chartWidth / data.length

  let cumulative = 0
  const points = data.map((item, index) => {
    cumulative += item.count
    const cumulativePercent = (cumulative / TOTAL_GWAGEO) * 100

    const x = padding.left + index * barWidth + barWidth / 2
    const y = padding.top + chartHeight - (cumulativePercent / 100) * chartHeight

    return { x, y }
  })

  // Path 문자열 생성 (폐곡선)
  let pathString = `M ${padding.left} ${padding.top + chartHeight} `

  // 첫 점으로 이동
  pathString += `L ${points[0].x} ${points[0].y} `

  // 부드러운 곡선으로 연결 (Quadratic Bezier Curve)
  for (let i = 1; i < points.length; i++) {
    const prevPoint = points[i - 1]
    const currentPoint = points[i]
    const controlX = (prevPoint.x + currentPoint.x) / 2
    pathString += `Q ${controlX} ${prevPoint.y}, ${currentPoint.x} ${currentPoint.y} `
  }

  // 마지막 점에서 아래로 내려와 폐곡선 완성
  const lastPoint = points[points.length - 1]
  pathString += `L ${lastPoint.x} ${padding.top + chartHeight} `
  pathString += `Z`

  return pathString
}

// 직사각형 path 생성 함수
function createRectanglePath(centerX, centerY, width, height) {
  const left = centerX - width / 2
  const right = centerX + width / 2
  const top = centerY - height / 2
  const bottom = centerY + height / 2

  return `M ${left} ${top} L ${right} ${top} L ${right} ${bottom} L ${left} ${bottom} Z`
}

// 상위 15개 본관 데이터 (지리적 좌표 포함)
// 좌표는 한반도 SVG 내의 상대적 위치 (0-1 범위의 정규화된 값)
const chartData = [
  { name: '전주이씨', fullName: '이 전주(全州)', count: 870, geoX: 0.30, geoY: 0.65 },
  { name: '안동권씨', fullName: '권 안동(安東)', count: 368, geoX: 0.70, geoY: 0.45 },
  { name: '파평윤씨', fullName: '윤 파평(坡平)', count: 346, geoX: 0.42, geoY: 0.42 },
  { name: '청주한씨', fullName: '한 청주(淸州)', count: 292, geoX: 0.48, geoY: 0.50 },
  { name: '남양홍씨', fullName: '홍 남양(南陽)', count: 292, geoX: 0.45, geoY: 0.44 },
  { name: '밀양박씨', fullName: '박 밀양(密陽)', count: 267, geoX: 0.75, geoY: 0.62 },
  { name: '광산김씨', fullName: '김 광산(光山)', count: 262, geoX: 0.32, geoY: 0.70 },
  { name: '연안이씨', fullName: '이 연안(延安)', count: 255, geoX: 0.35, geoY: 0.25 },
  { name: '여흥민씨', fullName: '민 여흥(驪興)', count: 242, geoX: 0.50, geoY: 0.45 },
  { name: '진주강씨', fullName: '강 진주(晉州)', count: 230, geoX: 0.60, geoY: 0.68 },
  { name: '경주김씨', fullName: '김 경주(慶州)', count: 213, geoX: 0.78, geoY: 0.55 },
  { name: '한산이씨', fullName: '이 한산(韓山)', count: 202, geoX: 0.40, geoY: 0.52 },
  { name: '반남박씨', fullName: '박 반남(潘南)', count: 201, geoX: 0.28, geoY: 0.72 },
  { name: '동래정씨', fullName: '정 동래(東萊)', count: 199, geoX: 0.80, geoY: 0.68 },
  { name: '청송심씨', fullName: '심 청송(靑松)', count: 198, geoX: 0.68, geoY: 0.42 }
]

// 지역별 비율 데이터 (글씨와 함께 나타날 원들)
// 한양(0.35, 0.6) 기준으로 재배치
const regionData = [
  { name: '한양', value: 9.8, geoX: 0.35, geoY: 0.6 },
  { name: '평양', value: 2.2, geoX: 0.2, geoY: 0.5 },
  { name: '경상', value: 1.0, geoX: 0.75, geoY: 0.85 },
  { name: '충청', value: 1.0, geoX: 0.55, geoY: 0.65 },
  { name: '함경', value: 1.0, geoX: 0.65, geoY: 0.30 },
  { name: '강원', value: 1.0, geoX: 0.55, geoY: 0.52 },
  { name: '전라', value: 1.0, geoX: 0.45, geoY: 0.9 },
  { name: '황해', value: 1.0, geoX: 0.30, geoY: 0.48 },
]

function ParetoChart() {
  const containerRef = useRef(null)

  // SVG 치수 설정
  const svgWidth = 1200
  const svgHeight = 1200 // viewport를 정사각형으로 크게 (한반도 공간 확보)
  const padding = { top: 600, right: 80, bottom: 120, left: 60 } // 상단 패딩 증가로 차트를 하단에 배치
  const numPoints = 300 // morphing을 위한 포인트 개수
  const chartOffset = 70 // 차트를 위로 올릴 오프셋 (x축 레이블 제외)

  // Pareto path 생성 후 포인트로 변환
  const paretoPoints = useMemo(() => {
    const path = createParetoPath(chartData, svgWidth, svgHeight, padding)
    return samplePathPoints(path, numPoints)
  }, [svgWidth, svgHeight])
  
  // 한반도 transform 정보 계산
  const koreaTransform = useMemo(() => {
    const chartWidth = svgWidth - padding.left - padding.right
    const chartHeight = svgHeight - padding.top - padding.bottom

    // 임시 SVG 생성해서 실제 bounding box 계산
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', KOREA_SVG_PATH)
    svg.appendChild(path)
    document.body.appendChild(svg)

    // path의 실제 bounding box
    const bbox = path.getBBox()
    const actualWidth = bbox.width
    const actualHeight = bbox.height
    const actualX = bbox.x
    const actualY = bbox.y

    document.body.removeChild(svg)

    console.log('Korea Path BBox:', {
      x: actualX,
      y: actualY,
      width: actualWidth,
      height: actualHeight,
      aspectRatio: actualWidth / actualHeight
    })

    // 한반도 크기 설정
    const scale = 1.0

    // 실제 크기 계산
    const scaledWidth = actualWidth * scale
    const scaledHeight = actualHeight * scale

    // 오른쪽으로 더 이동, 위로 올림 (viewport 내에서)
    const targetX = padding.left + chartWidth * 0.65
    const targetY = padding.top + (chartHeight - scaledHeight) / 2

    return { actualX, actualY, actualWidth, actualHeight, scale, targetX, targetY }
  }, [svgWidth, svgHeight])

  // 한반도 path를 스케일링 후 포인트로 변환
  const koreaPoints = useMemo(() => {
    // 임시 SVG 생성
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', KOREA_SVG_PATH)
    svg.appendChild(path)
    document.body.appendChild(svg)
    
    const pathLength = path.getTotalLength()
    const points = []
    
    const { actualX, actualY, scale, targetX, targetY } = koreaTransform
    
    for (let i = 0; i < numPoints; i++) {
      const dist = (i / (numPoints - 1)) * pathLength
      const point = path.getPointAtLength(dist)
      
      // bbox 기준으로 normalize 후 동일한 scale로 transform 적용
      points.push({
        x: (point.x - actualX) * scale + targetX,
        y: (point.y - actualY) * scale + targetY
      })
    }
    
    document.body.removeChild(svg)
    return points
  }, [koreaTransform])
  
  // 최적화된 한반도 포인트 (paretoPoints와 최단 거리로 매칭)
  const optimizedKoreaPoints = useMemo(() => {
    return optimizePointOrder(paretoPoints, koreaPoints)
  }, [paretoPoints, koreaPoints])

  // 직사각형 포인트 생성 (가로로 긴 직사각형, 화면 중앙정렬)
  const rectanglePoints = useMemo(() => {
    // SVG viewBox 중앙에 위치
    const rectWidth = svgWidth * 0.95  // 화면 가로의 70%
    const rectHeight = svgHeight * 0.5  // 화면 세로의 20%
    const rectCenterX = svgWidth / 2  // 가로 중앙
    // 세로 위치 - 화면 하단 쪽에 배치
    const rectCenterY = svgHeight * 0.8 - chartOffset

    const rectPath = createRectanglePath(rectCenterX, rectCenterY, rectWidth, rectHeight)
    return samplePathPoints(rectPath, numPoints)
  }, [svgWidth, svgHeight, chartOffset])

  // 최적화된 직사각형 포인트 (koreaPoints와 최단 거리로 매칭)
  const optimizedRectanglePoints = useMemo(() => {
    return optimizePointOrder(optimizedKoreaPoints, rectanglePoints)
  }, [optimizedKoreaPoints, rectanglePoints])

  // 스크롤 기반 progress 계산 - 차트가 화면에 들어온 후 시작
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"] // 차트가 화면 하단에 닿을 때 시작, 화면 상단을 벗어날 때 끝
  })

  // 레이블 및 원 opacity - 동일한 타이밍으로 사라짐
  const labelsOpacity = useTransform(scrollYProgress, [0, 0.3, 0.5], [1, 1, 0])
  const circlesOpacity = useTransform(scrollYProgress, [0, 0.3, 0.5], [1, 1, 0])

  // 3단계 Point-by-point morphing
  const morphedPath = useTransform(scrollYProgress, (progress) => {
    let interpolatedPoints

    if (progress < 0.3) {
      // 0~0.3: 파레토 유지
      interpolatedPoints = paretoPoints
    } else if (progress < 0.5) {
      // 0.3~0.5: 파레토 → 한반도
      const morphProgress = (progress - 0.3) / 0.2
      interpolatedPoints = paretoPoints.map((paretoPoint, i) => {
        const koreaPoint = optimizedKoreaPoints[i]
        return {
          x: paretoPoint.x + (koreaPoint.x - paretoPoint.x) * morphProgress,
          y: paretoPoint.y + (koreaPoint.y - paretoPoint.y) * morphProgress
        }
      })
    } else if (progress < 0.75) {
      // 0.5~0.75: 한반도 유지
      interpolatedPoints = optimizedKoreaPoints
    } else if (progress < 0.85) {
      // 0.75~0.85: 한반도 → 직사각형 (빠르게 morphing)
      const morphProgress = Math.min((progress - 0.75) / 0.1, 1)  // 1을 초과하지 않도록 제한
      interpolatedPoints = optimizedKoreaPoints.map((koreaPoint, i) => {
        const rectPoint = optimizedRectanglePoints[i]
        return {
          x: koreaPoint.x + (rectPoint.x - koreaPoint.x) * morphProgress,
          y: koreaPoint.y + (rectPoint.y - koreaPoint.y) * morphProgress
        }
      })
    } else {
      // 0.85~: 직사각형 유지 (완전히 고정)
      interpolatedPoints = optimizedRectanglePoints
    }

    return pointsToPath(interpolatedPoints)
  })

  return (
    <div className="pareto-chart-container" ref={containerRef}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="pareto-chart-svg"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: 'auto' }}
      >
        {/* 막대 차트 (원들) - 2열로 표시, 각 가문의 급제자 수에 비례한 높이 */}
        {/* 원들은 개별적으로 한반도 본관 위치로 이동 */}
        <g>
          {chartData.map((data, familyIndex) => {
            const chartWidth = svgWidth - padding.left - padding.right
            const chartHeight = svgHeight - padding.top - padding.bottom
            const barWidth = chartWidth / chartData.length

            const x = padding.left + familyIndex * barWidth
            const circlesNeeded = Math.ceil(data.count / 15)
            const circleRadius = Math.min(barWidth * 0.13, 7)

            const circles = []
            const numColumns = 2
            const circlesPerColumn = Math.ceil(circlesNeeded / numColumns)
            const baseY = padding.top + chartHeight - chartOffset

            for (let col = 0; col < numColumns; col++) {
              const startIdx = col * circlesPerColumn
              const endIdx = Math.min(startIdx + circlesPerColumn, circlesNeeded)

              for (let row = 0; row < endIdx - startIdx; row++) {
                const circleIndex = startIdx + row
                const startCx = x + (barWidth - numColumns * circleRadius * 2) / 2 + col * circleRadius * 2 + circleRadius
                const startCy = baseY - (row * circleRadius * 2) - circleRadius

                circles.push(
                  <motion.circle
                    key={`${familyIndex}-${circleIndex}`}
                    cx={startCx}
                    cy={startCy}
                    r={circleRadius}
                    fill="#000"
                    style={{ opacity: circlesOpacity }}
                  />
                )
              }
            }

            return <g key={familyIndex}>{circles}</g>
          })}
        </g>

        {/* Morphing 영역 */}
        <g transform={`translate(0, ${-chartOffset})`}>
          <motion.path
            d={morphedPath}
            fill="rgba(115, 115, 115, 0.2)"
            stroke="none"
          />
        </g>

        {/* 지역별 원들 - 글씨와 함께 순차적으로 나타남 */}
        <g>
          {regionData.map((region, index) => {
            const { actualWidth, actualHeight, scale, targetX, targetY } = koreaTransform
            const cx = targetX + region.geoX * actualWidth * scale
            const cy = targetY + region.geoY * actualHeight * scale - chartOffset

            // 크기는 value에 비례 (최대 4.9를 기준으로)
            const maxValue = 4.9
            const baseSize = 60 // 이미지 크기
            const size = (region.value / maxValue) * baseSize

            // 랜덤 Union 이미지 선택 (0-49)
            const randomUnionIndex = Math.floor(Math.random() * 50)
            const imageUrl = `/assets/Union-${randomUnionIndex}.png`

            // fade in & fade out
            // 0.55~0.65: fade in, 0.65~0.75: 유지, 0.75~0.85: fade out
            const fadeInStart = 0.55 + Math.min(index, 3) * 0.036
            const fadeInEnd = fadeInStart + 0.1
            const fadeOutStart = 0.85
            const fadeOutEnd = 0.95
            const regionOpacity = useTransform(
              scrollYProgress,
              [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
              [0, 1, 1, 0]
            )

            return (
              <g key={index}>
                <motion.image
                  href={imageUrl}
                  x={cx - size / 2}
                  y={cy - size / 2}
                  width={size}
                  height={size}
                  style={{ opacity: regionOpacity }}
                />
                <motion.text
                  x={cx}
                  y={cy + size / 2 + 15}
                  textAnchor="middle"
                  fontFamily="GyeongbokgungSumunjangBodyText, serif"
                  fontSize={(2.2 / maxValue) * baseSize * 0.35}
                  fontWeight="700"
                  fill="var(--text-dark)"
                  style={{ opacity: regionOpacity }}
                >
                  {region.name}
                </motion.text>
              </g>
            )
          })}
        </g>

        {/* 레이블 - 차트와 겹치게 네거티브 마진 */}
        <motion.g style={{ opacity: labelsOpacity }}>
          {chartData.map((data, index) => {
            const chartWidth = svgWidth - padding.left - padding.right
            const chartHeight = svgHeight - padding.top - padding.bottom
            const barWidth = chartWidth / chartData.length
            const x = padding.left + index * barWidth + barWidth / 2
            const label = data.name.replace(/\n/g, '')
            const chars = label.split('')

            return (
              <g key={index}>
                {chars.map((char, charIndex) => (
                  <text
                    key={charIndex}
                    x={x}
                    y={padding.top + chartHeight - 20 + charIndex * 18}
                    textAnchor="middle"
                    fontFamily="GyeongbokgungSumunjangBodyText, serif"
                    fontSize="14"
                    fontWeight="700"
                    fill="var(--text-dark)"
                  >
                    {char}
                  </text>
                ))}
              </g>
            )
          })}
          
          {/* 왼쪽 Y축 레이블 - 급제자 수 (최대값 기준) */}
          {[0, 1, 2, 3, 4, 5].map(i => {
            const chartHeight = svgHeight - padding.top - padding.bottom
            const maxCount = Math.max(...chartData.map(d => d.count))
            const count = Math.round((i / 5) * maxCount)
            const y = padding.top + chartHeight - (i / 5) * chartHeight - chartOffset

            return (
              <text
                key={`left-${i}`}
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                fontFamily="GyeongbokgungSumunjangBodyText, serif"
                fontSize="12"
                fontWeight="700"
                fill="steelblue"
              >
                {`${count}명`}
              </text>
            )
          })}

          {/* 오른쪽 Y축 레이블 - 누적 비율 (%) */}
          {[0, 1, 2, 3, 4, 5].map(i => {
            const chartHeight = svgHeight - padding.top - padding.bottom
            const chartWidth = svgWidth - padding.left - padding.right
            const percent = (i / 5) * 100
            const y = padding.top + chartHeight - (i / 5) * chartHeight - chartOffset

            return (
              <text
                key={`right-${i}`}
                x={padding.left + chartWidth + 10}
                y={y + 4}
                textAnchor="start"
                fontFamily="GyeongbokgungSumunjangBodyText, serif"
                fontSize="12"
                fontWeight="700"
                fill="red"
              >
                {`${percent.toFixed(0)}%`}
              </text>
            )
          })}
        </motion.g>
      </svg>

      {/* Morphing 완료 후 아래에서 올라오는 텍스트 */}
      <div className="pareto-text-container">
        <div className="pareto-text-block">
          <p>또한 경기 지역의 인구 비중을 고려했을 때,</p>
          <p>합격 비율은 지나치게 높게 나타납니다.</p>
        </div>

        <div className="pareto-text-block">
          <p className="text-spacer">이 편중은 시험 제도가 실제로는 한양과 그 주변에</p>
          <p>더 쉽게 접근할 수 있는 사람들에게 유리하게</p>
          <p>적용되었다는 사실을 보여줍니다.</p>
        </div>

        <div className="pareto-text-block">
          <p className="text-spacer">과거 시험 과정에 필요한 모든 복잡한 절차는</p>
          <p>중앙 관청·관료·학교가 밀집한 한양 주변에서</p>
          <p>훨씬 효율적으로 처리할 수 있었습니다.</p>
        </div>

        <div className="pareto-text-block">
          <p className="text-spacer">반대로 지방에서는 이동 거리와 비용,</p>
          <p>행정적 접근성, 교육 자원 등에서 불리함이 누적되었고,</p>
          <p>결국 응시자의 규모 자체가 작아져</p>
          <p>합격 비율에도 그대로 반영되었습니다.</p>
        </div>

        {/* morphing과 함께 나타나는 중앙정렬 텍스트 */}
        <div className="pareto-text-block-center">
          <p>이러한 격차는 조선시대 전반에 걸쳐 반복되었습니다.</p>
          <p>여러 왕들이 지역 편중을 완화하기 위한 제도적 보완책을 내놓았지만,</p>
          <p>그 효과는 시대마다 다르게 나타났습니다.</p>
          <p className="text-spacer">시간이 흐를수록 지역 간 격차는 완전히 해소되지 않았지만,</p>
          <p>제도 변화와 사회 구조의 변동에 따라 조금씩 다른 패턴이 나타납니다.</p>
          <p>노란 점을 눌러 각각의 시기마다 왜 이런 변화가 일어났는지 직접 탐색해보세요.</p>
        </div>
      </div>
    </div>
  )
}

export default ParetoChart
