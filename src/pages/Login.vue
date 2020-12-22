<template>
  <div id="login">
    
    <div class="loginArea" v-if="login">
      <h1>Entrar</h1>
      <form @submit.prevent="handleLogin">
        <input type="text" placeholder="Email" v-model="email">
        <input type="password" placeholder="Senha" v-model="password">
        <button type="submit">Acessar</button>
      </form>
      <a @click="toggleBtn">Criar uma conta</a>
    </div>

    <div class="loginArea" v-else>
      <h1>Cadastrar</h1>
      <form @submit.prevent="handleRegister">
        <input type="text" placeholder="Nome" v-model="nome">
        <input type="text" placeholder="Email" v-model="email">
        <input type="password" placeholder="Senha" v-model="password">
        <button type="submit">Cadastrar</button>
      </form>
      <a @click="toggleBtn">Já possuo uma conta</a>
    </div>
  </div>
</template>

<script>
import firebase from "../services/firebaseConnection"
export default {
  name: 'Login',
  data() {
    return {
      nome: '',
      email: '',
      password: '',
      login: true
    }
  },
  methods: {
    toggleBtn() {
      this.login = !this.login;
      this.nome = ''; this.email = ''; this.password = '';
    },
    async handleRegister() {
      const {user} = await firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
      await firebase.firestore().collection('users')
      .doc(user.uid).set({
        nome: this.nome,
      })
      .then( async () => {
        const usuarioLogado = {
          uid: user.uid,
          nome: this.nome
        };
        await localStorage.setItem('vuepost', JSON.stringify(usuarioLogado))

      })
      .catch(()=> {
        console.log("Erro no cadastro")
      });
      this.$router.push('/')
    },
    async handleLogin() {
      const {user} = await firebase.auth().signInWithEmailAndPassword(this.email, this.password)
      const userProfile = await firebase.firestore().collection('users')
      .doc(user.uid).get();

      const usuarioLogado = {
        uid: user.uid,
        nome: userProfile.data().nome
      }
      await localStorage.setItem('vuepost', JSON.stringify(usuarioLogado))
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
h1 {
  text-align: center;
  color: #fff;
}

.loginArea {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  margin-top: 65px;
  max-width: 600px;
  background: #4c5059;
  border-radius: 5px;
}

form {
  display: flex;
  flex-direction: column;
  margin: 0px 25px;
}

input {
  margin-bottom: 10px;
  height: 30px;
  width: 300px;
  font-size: 18px;
  padding: 10px;
  outline: none;
  border: 0;
  background: rgb(241, 241, 241);
}

button {
  height: 35px;
  border: 0;
  background: #7289DA;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  outline: none;
  cursor: pointer;
}

.loginArea a {
  margin-top: 20px;
  text-decoration: none;
  color: #fff;
  cursor: pointer;
}

</style>