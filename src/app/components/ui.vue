<template>
  <div class="ui-guide">
    <section>
      <h2>Buttons</h2>
      <h3>Regular</h3>
      <a href="#" class="button">Button</a>
      <a href="#" class="button button-dark">Dark</a>
      <a href="#" class="button button-info">Info</a>
      <a href="#" class="button button-success">Success</a>
      <a href="#" class="button button-warning">Warning</a>
      <a href="#" class="button button-danger">Danger</a>
      <a href="#" class="button" disabled>Disabled</a>
      <br><br>
      <h3>Bordered</h3>
      <a href="#" class="button button-bordered">Button</a>
      <a href="#" class="button button-dark button-bordered">Dark</a>
      <a href="#" class="button button-info button-bordered">Info</a>
      <a href="#" class="button button-success button-bordered">Success</a>
      <a href="#" class="button button-warning button-bordered">Warning</a>
      <a href="#" class="button button-danger button-bordered">Danger</a>
      <a href="#" class="button button-bordered" disabled>Disabled</a>
      <br><br>
      <h3>Loading</h3>
      <a href="#" class="button button-loading" disabled>Button</a>
      <a href="#" class="button button-dark button-loading" disabled>Dark</a>
      <a href="#" class="button button-info button-loading" disabled>Info</a>
      <a href="#" class="button button-success button-loading" disabled>Success</a>
      <a href="#" class="button button-warning button-loading" disabled>Warning</a>
      <a href="#" class="button button-danger button-loading" disabled>Danger</a>
      <br><br>
      <h3>Icons</h3>
      <a href="#" class="button button-icon"><span class="icon-bell"></span></a>
      <a href="#" class="button button-dark button-icon"><span class="icon-bar-chart"></span></a>
      <a href="#" class="button button-info button-icon"><span class="icon-anchor"></span></a>
      <a href="#" class="button button-success button-icon"><span class="icon-check"></span></a>
      <a href="#" class="button button-warning button-icon"><span class="icon-alert-triangle"></span></a>
      <a href="#" class="button button-danger button-icon"><span class="icon-x"></span></a>
    </section>
    <section>
      <h2>Messages</h2>
      <div class="message">Plain message.</div>
      <div class="message message-dark">Dark message.</div>
      <div class="message message-info">Info message.</div>
      <div class="message message-success">Success message.</div>
      <div class="message message-warning">Warning message.</div>
      <div class="message message-error">Error message.</div>
      <div class="message message-brand no-bottom-margin">Brand message.</div>
    </section>
    <section>
      <h2>Inputs</h2>
      <div class="form-input">
        <input type="text" class="input" placeholder="Regular input">
      </div>
      <div class="form-input">
        <float-label>
          <input type="text" class="input" placeholder="Input with floating label" value="Hello world!">
        </float-label>
      </div>
      <div class="form-input">
        <input type="password" class="input input-error" placeholder="Input with error">
      </div>
      <div class="form-input">
        <input type="text" class="input" placeholder="Disabled input" disabled>
      </div>

      <br>

      <div class="label">
        <label for="textarea-demo">Example Label</label>
      </div>
      <textarea id="textarea-demo" class="input" style="width: 100%; height: 160px;">This is a textarea input.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra tristique ex rutrum egestas. Nunc porta ipsum vitae mi varius, ac porttitor massa placerat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia efficitur tellus, ut scelerisque lacus. Suspendisse nec ipsum et lectus aliquam consequat at a augue. Duis quis feugiat justo, in facilisis ante. Proin sed dui quis arcu semper convallis.</textarea>
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
