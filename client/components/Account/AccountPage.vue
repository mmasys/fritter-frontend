<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main class="main">
    <section>
      <section>
        <header>
          <h2>Profile Page</h2>
        </header>
        <UserFollowerPage />
      </section>
      <header>
        <h2>Account settings</h2>
      </header>
      <ChangeUsernameForm />
      <ChangePasswordForm />
    </section>
    <section>
      <header>
        <h2>Account management</h2>
      </header>
      <LogoutForm />
      <DeleteAccountForm />
    </section>
  </main>
</template>

<script>
import ChangeUsernameForm from '@/components/Account/ChangeUsernameForm.vue';
import ChangePasswordForm from '@/components/Account/ChangePasswordForm.vue';
import DeleteAccountForm from '@/components/Account/DeleteAccountForm.vue';
import LogoutForm from '@/components/Account/LogoutForm.vue';
import UserFollowerPage from '@/components/Account/UserFollowerPage.vue'

export default {
  name: 'AccountPage',
  components: {
    ChangeUsernameForm,
    ChangePasswordForm,
    DeleteAccountForm,
    LogoutForm,
    UserFollowerPage
  }
};
</script>

<style scoped>
.main {
  background-color: #243447;
  color: #FFF;
  display: grid;
  height: 100%;
  width: 100%;
}
</style>