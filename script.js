var mainUrl =  'https://script.google.com/macros/s/AKfycbwkph2DnKH69GfdWMIjM1Lizuf2XbxpFtTuo9ySKc8QyvCgp1UCCQSgNrPrQw0b4D_I/exec' 
var gId, gData, gUrl;

  function getDataAPI(url) {         
    fetch(url, {  // Replace 123 with your ID
      method: 'GET',
      //mode: 'cors',
      //headers: { 'Content-Type': 'application/json' }
    })
    .then(response =>{      
      return response.json()        
    })
    .then(data => {
      if(data.data.length > 0){
        gData = data.data[0]
        gId = gData[4]
        console.log(gId);
      }
      else{
        Swal.fire({
          position: 'center',
          icon: 'warning',
          text: 'Link หมดอายุแล้ว โปรดลองใหม่อีกครั้ง',
          showConfirmButton: true,
          //timer: 10000
        });
        
        console.log('data not found')
        setTimeout(function(){
          window.location.href = "/"
        },5000)
      }      
      
    })
    .catch(error => {
      Swal.fire({
        position: 'center',
        icon: 'error',
        text: 'เกิดข้อผิดพลาดในการเชื่อมต่อ โปรดลองใหม่อีกครั้ง',
        showConfirmButton: true,
        //timer: 5000
      });
      console.error("Error in fetch:", error.message);
      
    })
    .finally(() => {
       loadingEnd()      
    });
  } 
  
  function beforeEdit(){
    if(gId){
      editData()
    }
    else{
      Swal.fire({
        position: 'center',
        icon: 'warning',
        text: 'Link หมดอายุแล้ว โปรดลองใหม่อีกครั้ง',
        showConfirmButton: true,
        //timer: 10000
      });
    }
  }
  
  function editData(){    
    const id =  gId
    const pwd1 = $('#pwd1').val()
    const pwd2 = $('#pwd2').val() 
    if(validateEditForm()){
      if(pwd1 === pwd2){
        const obj = {
          id:id,
          pwd1:pwd1,
          pwd2:pwd2 
        }
        submitEdit(obj)  
      } 
      else{
        Swal.fire({
          position: 'center',
          icon: 'error',
          //title: 'คิวนัดเต็ม!',
          text: 'รหัสผ่านกับรหัสยืนยันไม่ตรงกัน',
          showConfirmButton: true,
          timer: 3000
        })    
      }         
    }
     
  }  

  function submitEdit(obj) {
    document.getElementById("btn1").disabled = true;
    showSpin3()
    const obj_json = JSON.stringify(obj);
    let formData = new FormData();
    formData.append('action', 'editData');
    formData.append('data', obj_json);

    fetch(mainUrl, {
        method: 'POST', 
        redirect: "follow",
        mode: 'cors',            
        body: formData,
    })
    .then(response => response.json() )//response.json())
    .then(data => {
        console.log(data);
        if (data.status === "success") {
            $('#pwd1, #pwd2').val('');
            Swal.fire({
              position: 'center',
              icon: 'success',
              text: 'Reset สำเร็จ!',
              showConfirmButton: true,
              //timer: 3000
          });
        } else {
            Swal.fire({
                position: 'center',
                icon: 'error',
                text: 'Reset ล้มเหลวเนื่องจาก Link หมดอายุ โปรดลองใหม่อีกครั้ง',
                showConfirmButton: true,
                //timer: 10000
            });
            
        }
    })
    .catch(error => {
        console.error("Error:", error);
        Swal.fire({
            position: 'center',
            icon: 'error',
            text: 'เกิดข้อผิดพลาดในการเชื่อมต่อ โปรดลองใหม่อีกครั้ง',
            showConfirmButton: true,
            timer: 5000
        });
    })
    .finally(() => {
        document.getElementById("btn1").disabled = false;
        hideSpin3()
        removeValidate();
        setTimeout(function(){
          window.location.href = "/"
        },5000)
        
    });
}

  
  function validateEditForm(){
    const forms = document.querySelectorAll("#edit_form")
    
    Array.prototype.slice.call(forms).forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })

    return Array.prototype.every.call(forms,function(form){
        return form.checkValidity();
    });
  }

  function removeValidate(){
    const loginform = document.querySelectorAll("#edit_form")
    Array.prototype.slice.call(loginform).forEach(function(form){ 
        form.classList.remove('was-validated')              
     })       
  }  

  
  document.getElementById('btn1').addEventListener("click",e=>{
    beforeEdit()
  })
  
  function preventFormSubmit(){
    const forms = document.querySelectorAll('form');
    for (let i = 0; i < forms.length; i++) {
         forms[i].addEventListener('submit', function(event) {
            event.preventDefault();
         });
    }
  }

  function loadingStart(){      
      document.getElementById("loading").classList.remove("invisible");
  }
      
  function loadingEnd(){
      document.getElementById("loading").classList.add("invisible");     
  }

  function showSpin3(){
    document.getElementById('resp-spinner1').classList.remove("d-none");
    document.getElementById('resp-spinner2').classList.remove("d-none");
    document.getElementById('resp-spinner3').classList.remove("d-none");
  }

  function hideSpin3(){
    document.getElementById('resp-spinner1').classList.add("d-none");
    document.getElementById('resp-spinner2').classList.add("d-none");
    document.getElementById('resp-spinner3').classList.add("d-none");
  } 
  
  document.addEventListener('DOMContentLoaded',function(){
      loadingStart()
      preventFormSubmit()
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");

      if (id) {             
         gUrl = mainUrl+'?id='+id  
         //console.log("url",gUrl)
         getDataAPI(gUrl)
         
         //console.log("ID:", id);
      } else {
         loadingEnd()
         console.log("No ID found in URL.");
      }
  })
