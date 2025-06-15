# Tlachtga Theme

Retro Technomancy Esque Zola Theme

![Theme Preview](https://puppy-witch.github.io)

```bash
# Add theme to your Zola site
git submodule add https://github.com/puppy-witch/tlachtga-theme.git themes/tlachtga
```
Set theme in `config.toml`:
```toml
theme = "tlachtga"
```

Copy example content:
```bash
cp -r themes/tlachtga/content/* content/
cp themes/tlachtga/config.toml .
```

Build your site:
```bash
zola build
```

## Features

- **Theme Switching** - Dark/light modes with system preference detection
- **Accessible** - Screen reader support, keyboard navigation, high contrast
- **Custom Shortcodes** - Alerts, code blocks, project cards, and more
- **Responsive Design** - Works on all devices
- **Performance** - Fast loading, minimal JavaScript
- **Customisable** - Easy color and font customisation

## Shortcodes

### Alert
```markdown
{% alert(type="warning") %}
Important message here!
{% end %}
```

### Spell Block
```markdown
{% spell(title="My Spell", difficulty="beginner") %}
Instructions for your digital magic...
{% end %}
```

### Project Card
```markdown
{% project-card(title="My Project", tech_stack=["Rust", "HTML"]) %}
Project description...
{% end %}
```

## Configuration

See the example `config.toml` for all available options.

## License

Anti-Capitalist Software (License)[/LICENSE]

## Credits

Created by [Puppy Witch](https://github.com/puppy-witch) with love and lots of caffeine ☕
EOF