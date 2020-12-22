<template>
  <div id="home">
    <div class="newpost">
      <h2>Bem vindo de volta</h2>
      <span>Compartilhe seu dia</span>
      <textarea placeholder="O que esta fazendo hoje?" rows="15" v-model="input"></textarea>
      <button @click="createPost">Compartilhar</button>
    </div>

    <div class="postarea loading" v-if="loading">
      <h2>Buscando...</h2>
    </div>

    <div class="postarea" v-else>
      <article class="post" v-for="post in posts" :key="post.id">
        <h1>{{post.autor}}</h1>
        <p>{{post.content | postLength}}</p>
        <div class="action-post">
          <button>{{post.likes === 0 ? 'Curtir' : post.likes + ' Curtidas'}}</button>
          <button>Veja post completo</button>
        </div>
      </article>

    </div>
  </div>
</template>

<script>
import firebase from "../services/firebaseConnection"

export default {
  name: 'Home',
  data() {
    return {
      input: '',
      user: {},
      loading: true,
      posts: []
    }
  },
  async created() {
    const user = localStorage.getItem('vuepost');
    this.user = JSON.parse(user);
    await firebase.firestore().collection('posts')
    .onSnapshot((doc) => {
      this.posts = []
      doc.forEach((item) => {
        this.posts.push({
          id: item.id,
          autor: item.data().autor,
          content: item.data().content,
          likes: item.data().likes,
          created: item.data().created,
          userId: item.data().userId
        })
      })
      this.loading = false;
      console.log(this.posts)
    })
  },
  methods: {
    async createPost() {
      if(this.input === '') {
        alert("Campo de post vazio, digite alguma coisa")
        return;
      } 
      await firebase.firestore().collection('posts')
      .add({
        created: new Date(),
        content: this.input,
        autor: this.user.nome,
        userId: this.user.uid,
        likes: 0
      })
      .then(()=> {
        this.input = '';
        alert("Post criado com sucesso")
      })
      .catch((error)=> {
        console.log("Erro ao criar post: "+ error)
      })
    }
  },
  filters: {
    postLength(valor) {
      if(valor.length < 200) {
        return valor;
      } 
      return `${valor.substring(0, 200)}...`
    }
  }
}
</script>

<style scoped>
#home {
  display: flex;
  flex-direction: row;
  margin: 25px;
}

@import './home.css';
</style>