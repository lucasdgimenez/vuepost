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
        <router-link tag="h1" :to="`/perfil/${post.userId}`">{{post.autor}}</router-link>
        <p>{{post.content | postLength}}</p>
        <div class="action-post">
          <button @click="likePost(post.id, post.likes)">
            {{post.likes === 0 ? 'Curtir' : post.likes + ' Curtidas'}}</button>
          <button @click="togglePostModal(post)">Veja post completo</button>
        </div>
      </article>
    </div>

    <Modal v-if="showPostModal" :post="fullPost" @close="togglePostModal()"/>
  </div>
</template>

<script>
import firebase from "../services/firebaseConnection"
import Modal from "../components/Modal"


export default {
  name: 'Home',
  components: {
    Modal
  },
  data() {
    return {
      input: '',
      user: {},
      loading: true,
      posts: [],
      showPostModal: false,
      fullPost: {}
    }
  },
  async created() {
    const user = localStorage.getItem('vuepost');
    this.user = JSON.parse(user);
    await firebase.firestore().collection('posts')
    .orderBy('created', 'desc')
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
    },
    async likePost(id, likes) {
      const userId = this.user.uid;
      //cria uma id nova do id user e id post
      const docId = `${userId}_${id}`
      //checando se o post ja foi curtido
      const doc = await firebase.firestore().collection('likes')
      .doc(docId).get()
      if(doc.exists) { //se existir, é porque ja dei like
        await firebase.firestore().collection('posts')
        .doc(id).update({
          likes: likes - 1
        })
        await firebase.firestore().collection('likes')
        .doc(docId).delete();
        return;
      } 
      //cria o like
      await firebase.firestore().collection('likes')
      .doc(docId).set({
        postId: id,
        userId: userId
      })
      //soma o like
      await firebase.firestore().collection('posts')
      .doc(id).update({
        likes: likes + 1
      })
    },
    togglePostModal(post) {
      this.showPostModal = !this.showPostModal;
      if(this.showPostModal) {
        this.fullPost = post;
      } else {
        this.fullPost = {};
      }
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