<template>
  <div class="container">
    <div class="col-12">
      <div class="ui-guide">
        <section>
          <h2>Button</h2>
          <a class="button">Button</a>
          <a class="button-dark">Dark</a>
          <a class="button-info">Info</a>
          <a class="button-success">Success</a>
          <a class="button-warning">Warning</a>
          <a class="button-danger">Danger</a>
          <a
            class="button"
            disabled>Disabled</a>
          <br><br>
          <h3>Button Sizes</h3>
          <a class="button-md">Medium</a>
          <a class="button">Regular</a>
          <a class="button-sm">Small</a>

          <br><br>
          <h3>Loading Button</h3>
          <a
            class="button-info button-loading"
            disabled>Loading button</a>
          <br><br>
          <h3>Bordered Button</h3>
          <a class="button-info button-bordered">Bordered Button</a>
          <a
            class="button-bordered"
            disabled>Disabled Bordered Button</a>
          <br><br>
          <h3>Icon Only Button</h3>
          <a class="button-info button-icon"><span class="icon-move"/></a>
        </section>
        <section class="messages">
          <h2>Message</h2>
          <div class="col-container">
            <div class="message col-4">Plain</div>
            <div class="message col-4 message-dark">Dark</div>
            <div class="message col-4 message-info">Info</div>
          </div>
          <div class="col-container">
            <div class="message col-4 message-success">Success</div>
            <div class="message col-4 message-warning">Warning</div>
            <div class="message col-4 message-error">Error</div>
          </div>
          <div class="col-container">
            <div class="message col-12">
              <div>
                <h5>Advanced Message</h5>
                <p>This is extra optional text you can add to your message.</p>
              </div>
              <div class="actions">
                <button class="button">Action Button</button>
                <button class="button">Another Action</button>
              </div>
            </div>
          </div>
        </section>
        <section>
          <h2>Headers</h2>
          <h1>H1 Title</h1>
          <h2>H2 Title</h2>
          <h3>H3 Title</h3>
          <h4>H4 Title</h4>
          <h5>H5 Title</h5>
          <h6>H6 Title</h6>
        </section>
        <section>
          <h2>Inputs</h2>
          <div class="form-input">
            <input
              type="text"
              class="input"
              placeholder="Regular input">
          </div>
          <div class="form-input">
            <float-label>
              <input
                type="text"
                class="input"
                placeholder="Input with floating label"
                value="Hello world!">
            </float-label>
          </div>
          <div class="form-input">
            <input
              type="password"
              class="input input-error"
              placeholder="Input with error">
          </div>
          <div class="form-input">
            <input
              type="text"
              class="input"
              placeholder="Disabled input"
              disabled>
          </div>

          <br>

          <div class="label">
            <label for="textarea-demo">Example Label</label>
          </div>
          <textarea
            id="textarea-demo"
            class="input"
            style="width: 100%; height: 160px;">This is a textarea input.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra tristique ex rutrum egestas. Nunc porta ipsum vitae mi varius, ac porttitor massa placerat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia efficitur tellus, ut scelerisque lacus. Suspendisse nec ipsum et lectus aliquam consequat at a augue. Duis quis feugiat justo, in facilisis ante. Proin sed dui quis arcu semper convallis.</textarea>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
</script>

<style lang="scss" scoped>
section {
  margin-bottom: $pad;
  padding: $pad;
  background: $white;
  border-radius: 4px;
  border: 1px solid $color-border;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
