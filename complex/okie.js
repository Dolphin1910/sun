import {test1} from './test1.js';
import {test2} from './test2.js';


var test12sArr = [];
var selectedType = 0;
var limitIndex = 6;
var numberLimit = 0;
var isRemove = 1;
var setTML = [];

$('.scroll-bottom-btn').click(() => {
    window.scrollTo(0, document.body.scrollHeight);
});

$('.test1-btn').click(() => {
    selectedType = 1;
    test12sArr = test1;
    numberLimit = 55;
    $('.button-container .amount>span').text(test12sArr.length);
    $('.show-messi-container').css('display', 'block');
});
$('.test2-btn').click(() => {
    selectedType = 2;
    test12sArr = test2;
    numberLimit = 45;
    $('#show-messi').prop('checked', false);
    $('.button-container .amount>span').text(test12sArr.length);
    $('.show-messi-container').css('display', 'none');
});
$('.fuck-btn').click(getPMInfo);
$('.reset-btn').click(() => {
    resetResult(); 
    selectedType = 0;
    $('#filter-numb-cb').prop('checked', false);
});
$('.you-btn').click(filterOnPMs);
$("#test12-value").change(function(){
    $('.result-container, .filter-result-container').css('display', 'none');
    
    if(!validatetest12(true)) {
        return;
    }
    let test12V = Number($("#test12-value").val());
    let bsNumbs = test12sArr[test12V - 1].length;
    $('.test12__amount-bs>span').text(bsNumbs);
    $('#bs-value').val(bsNumbs);
    $('.err-noti').text("");
    setHTMLOfAllBS(test12V-1);
});
$("#bs-value").change(function(){
    $('.result-container, .filter-result-container').css('display', 'none');
    
    if(!validatetest12()) {
        return;
    }
    let test12V = Number($("#test12-value").val());
    $('.err-noti').text("");
    setHTMLOfAllBS(test12V-1);
});
$('#show-messi').on('click', function(e) {
    $('.result-container, .filter-result-container').css('display', 'none');
});
$('#filter-numb-cb').on('click', function(e) {
    $('input[type="radio"]').prop('checked', false);
    $('.filter-result-c__match-first-numb, .filter-result__inconsistent, .result-container').css('display', 'none');

});
$('input[type="radio"]').on('click', function(e) {
    $('#filter-numb-cb').prop('checked', false);
    $('.filter-result-c__filtered-numb').css('display', 'none');
    filterOnPMs();
});
$('.okie-btn').click(() => {
    
    if($('#filter-numb-cb').is(':checked')) {
        let _x = $("#any-text").val();
        let _arr = _x.split(' ').map((e) => Number(e));
        let _count = 0;
        let _liHTML = '';
        test12sArr.forEach((e1, i1) => {
            e1.forEach((e2, i2) => {
                let _temp = '';
                e2.forEach((e3, i3) => {
                    if(_arr.indexOf(e3) >= 0) {
                        _count++;
                        _temp += `<span class='match-numb'>${e3}</span>`;
                    }else {
                        _temp += `<span>${e3}</span>`;
                    }
                });
                if(_count == _arr.length) {
                    _liHTML += "<li>"+_temp+`<span class='match-numb' style='width: auto';> (${i1+1} - ${i2+1})</span> </li>`;
                }
                _count = 0;
                _temp = '';
            });
        });
        $('.filter-result-c__couple-numb .numb-of-result').text((_liHTML.match(/<li>/g) || []).length);
        $('.filter-result-c__couple-numb .matching-numbs-list').html(_liHTML);
    } else {
        const _data = Number($('input[name=optradio]:checked').val())>=0 ? setTML.flat() : test12sArr.flat().flat();
        const _counts = {};
        let _html = '';
        let _arr = [];

        for (const num of _data) {
            _counts[num] = _counts[num] ? _counts[num] + 1 : 1;
        }

        for (let x in _counts) {
            _arr.push({numb: x, count: _counts[x]});
        }
        _arr.sort((a, b) => {
            return b.count - a.count;
        }).forEach(e => {
            _html += `<span>${e.numb}-<span class="match-numb">${e.count}</span></span>`;
        });
        $('.filter-result-c__analysis').html(_html);
    }
    
});

function setHTMLOfAllBS(test12) {
  let strBSIsHTML = ''; 
  let bsV = Number($('#bs-value').val()) - 1;
  test12sArr[test12].forEach((_bs, _iBS) => {
    let numbStrIsHTML = '';
    _bs.forEach((numb, index) => {
        if(index < limitIndex) {
            numbStrIsHTML += "<span>"+numb+"</span>";
        } else {
            numbStrIsHTML += "<span class='bs__separation'> | </span><span>"+numb+"</span>";
        }
        
    });
    strBSIsHTML += `<li style=${_iBS == bsV? "color:red;": ""}>`+numbStrIsHTML+`<span style='color: red;'>${_iBS+1}</span>`+"</li>";
  });
  $('.all-BS').html(strBSIsHTML);
}

function validatetest12 (skipLastCheck = false) {
    let test12V = Number($("#test12-value").val());
    let bsV = Number($('#bs-value').val());
    let initialBSNumb = Number($('.test12__amount-bs>span').text());

    if(!selectedType) {
        $('.result-container').css('display', 'none');
        return false;
    } else if(!test12V || test12V > test12sArr.length || test12V < 0) {
        
        $('.test12__amount-bs>span').text(0);
        $('.all-BS').html('');
        $('#bs-value').val(1);
        $('.result-container').css('display', 'none');
        return false;
    } else if(bsV > initialBSNumb && !skipLastCheck) {
        $('.result-container').css('display', 'none');
        return;
    }
    $('.err-noti').text('');
    return true;
}

function getPMInfo() {
    $('input[type="radio"]').prop('checked', false);
    $('#filtered-numb').val(null);
    $('.result-container, .filter-result-container').css('display', 'none');

    if(!validatetest12()) {
        return;
    }

    $('.bs-list').html('');

    let test12V =  Number($('#test12-value').val())-1;
    let bsV = Number($('#bs-value').val())-1;

    let mapObj = new Map();
    let setArraysContainDupNumbs = [];
    let setArraysContainNumbsDisappear = [];
    let strBSIsHTML = '';
    let isShowSevent = $('#show-messi').is(':checked');
      
    for(let i = 1; i <= numberLimit; i++) {
        mapObj.set(i, 0);
    }
      
    test12sArr[test12V].forEach((_bs, pmIndex) => {
        if(pmIndex <= bsV) {
            let mapObjOnBS = new Map();
            let setObj = new Set([]);
            let cacSoLienTiep = [];
            let numbStrIsHTML = '';
            let paramsStrIsHTML = '';
            _bs.forEach((numb, cIndex) => {
                if(!isShowSevent && cIndex == limitIndex) {return;}
                numbStrIsHTML += isShowSevent && cIndex == limitIndex ? "<span class='bs__separation'> | </span><span>"+numb+"</span>" : "<span>"+numb+"</span>";
                mapObj.set(numb, mapObj.get(numb)+1);
                if(mapObjOnBS.has(mapObj.get(numb))) {
                    mapObjOnBS.get(mapObj.get(numb)).push(numb);
                } else {
                    mapObjOnBS.set(mapObj.get(numb), [numb]);
                }
                
                if(cIndex+1 <= limitIndex && (_bs[cIndex+1] - numb) == 1) {
                    setObj.add(numb).add(numb+1);
                }
            });

            
            for (let key of mapObjOnBS) {
                let paramV = key[1].length + ' : ' + key[0] + ' : ' + key[1].join(', ');
                paramsStrIsHTML += "<p>"+paramV+"</p>";
            }
            
            cacSoLienTiep = Array.from(setObj);
            if(cacSoLienTiep.length > 0) {
                let paramV = cacSoLienTiep.length + ' : ' + cacSoLienTiep.join(', ');
                paramsStrIsHTML += "<p>"+paramV+"</p>";
            }

            strBSIsHTML += "<li>"+("<div class='bs__numbers'>"+numbStrIsHTML+"</div>") +("<div class='bs__parameters'>"+paramsStrIsHTML+"</div>")+"</li>";

            $('.bs-list').html(strBSIsHTML);
        }
        
    });
      
    for (let numb of mapObj) {
        if(numb[1]) {
          setArraysContainDupNumbs.push("<span>"+numb[0] + '-' + numb[1]+"</span>");
        } else {
          setArraysContainNumbsDisappear.push("<span>"+numb[0] + '-' + numb[1]+"</span>")
        }
    }
    $('.test12__sledN-resl p').html(setArraysContainDupNumbs.join(', '));
    $('.test12__USledN-resl p').html(setArraysContainNumbsDisappear.join(', '));

    $('.result-container').css('display', 'block');

}

function filterOnPMs() {
    setTML = [];
    let test12V =  Number($('#test12-value').val())-1;
    let bsV = Number($('#bs-value').val())-1;
    let filteredNumbIsStr = $("#filtered-numb").val().trim().split('').join('_');
    let filteredNumb = Number($("#filtered-numb").val());
    let type = Number($('input[name=optradio]:checked').val());
    let mapA = new Map();
    let liHTML = '';
    let otherLiHTML = '';
    let bsLimit = test12V < 0 ? Infinity : bsV;
    let _test12sArr = test12V >= 0 ? [test12sArr[test12V]] : test12sArr;
    let isCheckOnFilterByNumbCb = $('#filter-numb-cb').is(':checked');
    let isShowSevent = selectedType == 1 && $('#show-messi').is(':checked') ? true: false;

    $('.result-container').css('display', 'none');
    $('.err-noti').text('');

    let _limitIndex = !isCheckOnFilterByNumbCb && isShowSevent ? limitIndex + 1 : limitIndex;
    _test12sArr.forEach((pm, iPM) => {
        pm.forEach((bs, iBS) => {
            if(iBS <= bsLimit) {
                if(isCheckOnFilterByNumbCb) {
                    if(bs.indexOf(filteredNumb) >=0) {
                        let str = '';
                        bs.forEach((numb, _iNumb) => {
                            str += `<span ${numb == filteredNumb ? "class='match-numb'" : ''}>${!isShowSevent && _iNumb == _limitIndex? '': numb}</span>`;
                        })
                        liHTML += "<li>"+str+`<span class='match-numb' style='width: auto';> (${test12V >= 0 ? iBS + 1: `${iPM+1} - ${iBS+1}`})</span> </li>`;
                    }
                } else {
                    let str = '';
                    if(type == 0 && bs[0] < 10 && bs[1] < 10 ) {
                        for(let i = type; i < _limitIndex; i++) {
                            if(bs[i]>=10) {
                                str += (bs[i]+'')[0];
                            }
                        }
                        
                    } else if(type == 1 && bs[0] < 10 && bs[1] >= 10) {
                        for(let i = type; i < _limitIndex; i++) {
                            if(bs[i]>=10) {
                                str += (bs[i]+'')[0];
                            }
                        }
                        
                    } else if(type == 2 && bs[0] >= 10 && bs[1] >= 10) {
                        for(let i = 0; i < _limitIndex; i++) {
                            if(bs[i]>=10) {
                                str += (bs[i]+'')[0];
                            }
                        }
                    }

                    if(str) {
                        str = str.split('').join('_');
                        let bs_C = [...bs];
                        if(selectedType == 1 && !isShowSevent) {
                            bs_C.pop();
                        }
                        if(mapA.has(str)) {
                            let obj = mapA.get(str);
                            obj.numbOfOccurrences += 1;
                            obj.inPM += 1+iPM + ' '; 
                            obj.bssArr.push(`${iBS == bsV && test12V >= 0 ? "*" : ""}`+ bs_C.join(', ') + ` (${test12V >= 0 ? iBS + 1: iPM+1 + ' - ' +(iBS+1)})`)
                        } else {
                            mapA.set(str,{
                                numbOfOccurrences: 1,
                                inPM: 1+iPM+' ', 
                                bssArr: [`${iBS == bsV && test12V >= 0 ? "*" : ""}`+bs_C.join(', ') + ` (${test12V >= 0 ? iBS + 1: iPM+1 + ' - ' +(iBS+1)})`]
                            })
                        }
                    }
                }
                
            }
        })
    });

    if(isCheckOnFilterByNumbCb) {
        $('.filter-result-c__filtered-numb .matching-numbs-list').html(liHTML);
        $('.filter-result-container, .filter-result-c__filtered-numb').css('display', 'block');
        $('.filter-result-c__filtered-numb .numb-of-result').text((liHTML.match(new RegExp("<li>", "g")) || []).length);

        return;
    }
      
    for (let ds of mapA) {
        let _arr = []
        let newBSsArr = ds[1].bssArr.map((bs) => {
            let _elem = bs.replaceAll(',', '').split(' ');
            _arr.push(_elem.filter((e) => !isNaN(e)).map((e) => Number(e)))
            return `<p>${bs}</p>`;
        });
        if(filteredNumbIsStr && ds[0].indexOf(filteredNumbIsStr) >= 0) {
            setTML.push(..._arr);
            liHTML += `<li> <p>${ds[0]}---<span>${ds[1].numbOfOccurrences}</span>---${ds[1].inPM.trim().split(' ').join('_')}</p> ${newBSsArr.join('')} </li>`;
        } else {
            if(!filteredNumb) {
                setTML.push(..._arr);
            }
            otherLiHTML += `<li> <p>${ds[0]}---<span>${ds[1].numbOfOccurrences}</span>---${ds[1].inPM.trim().split(' ').join('_')}</p> ${newBSsArr.join('')} </li>`;
        };
    }

    $('.filter-result-c__match-first-numb .dau-so-list').html(liHTML);
    $('.filter-result__inconsistent .dau-so-list').html(otherLiHTML);
    $('.filter-result-c__match-first-numb h5 .numb-of-result').text((liHTML.match(new RegExp("<li>", "g")) || []).length);
    $('.filter-result__inconsistent h5 .numb-of-result').text((otherLiHTML.match(new RegExp("<li>", "g")) || []).length);
    $('.filter-result-container, .filter-result-c__match-first-numb, .filter-result__inconsistent').css('display', 'block');
}
