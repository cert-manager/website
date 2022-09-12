# Variable Substitution

Adding a comment:

````markdown
<!--export-to-input-->

```bash
export OPSTRACE_CLUSTER_NAME=<choose_a_name>
```

<!--/export-to-input-->
````

will render an input that replaces all `$OPSTRACE_CLUSTER_NAME` with the input's value

## Usage

````markdown
<!--export-to-input-->

```bash
export OPSTRACE_CLUSTER_NAME=<choose_a_name>
```

<!--/export-to-input-->

```bash
./opstrace create aws $OPSTRACE_CLUSTER_NAME \
  -c opstrace-config.yaml
```
````
