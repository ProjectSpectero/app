<template>
  <div class="ui-guide">
    <section>
      <h2>Buttons</h2>
      <a href="#" class="button">Button</a>
      <a href="#" class="button button-dark">Dark</a>
      <a href="#" class="button button-info">Info</a>
      <a href="#" class="button button-success">Success</a>
      <a href="#" class="button button-warning">Warning</a>
      <a href="#" class="button button-danger">Danger</a>
      <a href="#" class="button" disabled>Disabled</a>
    </section>
    <section>
      <h2>Messages</h2>
      <div class="message info">Info message.</div>
      <div class="message success">Success message.</div>
      <div class="message warning">Warning message.</div>
      <div class="message error no-bottom-margin">Error message.</div>
    </section>
    <section>
      <h2>Inputs</h2>
      <div class="form-input">
        <input type="text" class="input" placeholder="Text input">
      </div>
      <div class="form-input">
        <input type="password" class="input" placeholder="Password input">
      </div>
      <div class="form-input">
        <input type="text" class="input" placeholder="Disabled input" disabled>
      </div>

      <br>

      <div class="label">
        <label for="textarea-demo">Example Label</label>
      </div>
      <textarea id="textarea-demo" class="input" style="width: 100%; max-width: 800px; height: 160px;">This is a textarea input.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra tristique ex rutrum egestas. Nunc porta ipsum vitae mi varius, ac porttitor massa placerat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia efficitur tellus, ut scelerisque lacus. Suspendisse nec ipsum et lectus aliquam consequat at a augue. Duis quis feugiat justo, in facilisis ante. Proin sed dui quis arcu semper convallis.</textarea>
    </section>
  </div>
</template>

<script>
</script>

<style lang="scss" scoped>
section {
  margin: $pad;
  padding: $pad;
  background: $white;
  border-radius: 4px;
  border: 1px solid $color-border;

  h2 {
    display: block;
    margin-bottom: 20px;
  }
}
</style>
