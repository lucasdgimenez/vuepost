<template>
  <header id="header">
    <router-link to="/">Post</router-link>
    <router-link tag="button" to="/dashboard">Dashboard</router-link>
  </header>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style>
#header {
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  height: 60px;
  background: #202225;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

#header a {
  text-decoration: navajowhite;
  font-size: 30px;
  color: #fff;
  cursor: pointer;
  font-weight: bold;
}

button {
  cursor: pointer;
  border: 0;
  color: #fff;
  background: transparent;
  padding: 5px 15px;
  outline: none;
  font-weight: bold;
}
</style>