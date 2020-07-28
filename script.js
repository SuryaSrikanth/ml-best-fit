// function getXs(arr){
//     let Xs = []
//     arr.forEach(element => {
//         Xs.push(element[0])
//     });
//     return Xs
// }

// function getYs(arr){
//     let Ys = []
//     arr.forEach(element => {
//         Ys.push(element[1])
//     });
//     return Ys
// }


function toint(arr){
    let Ys = []
    arr.forEach(element => {
        Ys.push(parseInt(element))
    });
    return Ys
}

function makeDataobj(Xs, Ys){
    let l = Math.min(Ys.length, Xs.length);
    let dataobj = []
    for(i =0; i< l; i++){
        d = {x: Xs[i], y: Ys[i]}
        dataobj.push(d)
    }
    return dataobj;
}


document.getElementById('train').onclick = ()=>{

    const model = tf.sequential();
    model.add(tf.layers.dense({units:128, inputShape:[1]}));
    model.add(tf.layers.dense({units:128, inputShape:[128], activation:"sigmoid"}));
    model.add(tf.layers.dense({units:1, inputShape:[128]}));
    let lr = document.getElementById('learningrate').value;
    model.compile({loss:"meanSquaredError", optimizer:tf.train.adam(lr)});


    let valx = document.getElementById('textareaX').value;
    let valy = document.getElementById('textareaY').value;
    let epochs = document.getElementById('epochs').value;
    
    

    valx = valx.split(",")
    valy = valy.split(",")
    valx = toint(valx)
    valy = toint(valy)
    model.fit(tf.tensor(valx), tf.tensor(valy), {epochs: epochs}).then(() => {
    
        let bestfit = model.predict(tf.tensor2d(valx, [valx.length, 1])).dataSync();

        var ctx = document.getElementById('myChart').getContext('2d');
        let dataobj = makeDataobj(valx, valy);
        let dataobjfit = makeDataobj(valx, bestfit);    
        var scatterChart = new Chart(ctx, {
            type:'line',
            labels: valx,
            data: {
                datasets: [
                    {
                        label: 'Best Fit',
                        backgroundColor: 'red',
                        borderColor: "rgba(218,83,79, .7)",
                        // data: dataobjfit,
                        data: dataobjfit,
                        borderWidth: 1,  
                        fill:false
                    },{
                    type: 'bubble',
                    label: 'Train Dataset',
                    backgroundColor: 'green',
                    radius:4,
                    data: dataobj
                }
                ]
            },
            options: {
                scales: {
                    xAxes: [{
                        type: 'linear',
                        position: 'bottom'
                    }]
                }
            }
        });
    });


    // console.log(valx)
    // console.log(valy)

    
    
}

