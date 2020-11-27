<template>
    <div class="overlay">
        <div class="cent">
              <div class="card-md">
                  <h3>Forgot Password</h3>
                  <label>
                      <small>Email</small>
                      <input type="email" v-model="email"/>
                  </label>
                  <button @click="send"></button>
              </div>

        </div>
    </div>
</template>
<script>
const axios = require('axios');
const validator = require("email-validator");
 

export default {
    data(){
        return {
            email: '',
        }
    },
    methods: {
        send(){
            if(validator.validate(this.email)){
                axios({
                    method: 'post',
                    url: '/users/forgot_pass',
                    data: {
                        email: this.email
                    }
                })
            }
            else{

            }
        }
    }
}
</script>