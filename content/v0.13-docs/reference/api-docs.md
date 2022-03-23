---
title: API reference docs
description: cert-manager API reference documentation
---

<p>Packages:</p>
<ul>
  <li>
    <a href="#acme.cert-manager.io%2fv1alpha2">acme.cert-manager.io/v1alpha2</a>
  </li>
  <li>
    <a href="#acme.cert-manager.io%2fv1alpha3">acme.cert-manager.io/v1alpha3</a>
  </li>
  <li>
    <a href="#cert-manager.io%2fv1alpha2">cert-manager.io/v1alpha2</a>
  </li>
  <li>
    <a href="#cert-manager.io%2fv1alpha3">cert-manager.io/v1alpha3</a>
  </li>
  <li>
    <a href="#meta.cert-manager.io%2fv1">meta.cert-manager.io/v1</a>
  </li>
</ul>
<h2 id="acme.cert-manager.io/v1alpha2">acme.cert-manager.io/v1alpha2</h2>
<div>
  <p>Package v1alpha2 is the v1alpha2 version of the API.</p>
</div>
Resource Types:
<ul>
  <li>
    <a href="#acme.cert-manager.io/v1alpha2.Challenge">Challenge</a>
  </li>
  <li>
    <a href="#acme.cert-manager.io/v1alpha2.Order">Order</a>
  </li>
</ul>
<h3 id="acme.cert-manager.io/v1alpha2.Challenge">Challenge</h3>
<div>
  <p>Challenge is a type to represent a Challenge request with an ACME server</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>acme.cert-manager.io/v1alpha2</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>Challenge</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ChallengeSpec">ChallengeSpec</a>
        </em>
      </td>
      <td>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>authzURL</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p>AuthzURL is the URL to the ACME Authorization resource that this challenge is a part of.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>type</code>
              <br />
              <em>
                <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeType">ACMEChallengeType</a>
              </em>
            </td>
            <td>
              <p>Type is the type of ACME challenge this resource represents, e.g. &ldquo;dns01&rdquo; or &ldquo;http01&rdquo;</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>url</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p>URL is the URL of the ACME Challenge resource for this challenge. This can be used to lookup details about the status of this challenge.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>dnsName</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p>DNSName is the identifier that this challenge is for, e.g. example.com.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>token</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p>Token is the ACME challenge token for this challenge.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>key</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p>Key is the ACME challenge key for this challenge</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>wildcard</code>
              <br />
              <em>bool</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>Wildcard will be true if this challenge is for a wildcard identifier, for example &lsquo;*.example.com&rsquo;</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>solver</code>
              <br />
              <em>
                <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolver">ACMEChallengeSolver</a>
              </em>
            </td>
            <td>
              <p>Solver contains the domain solving configuration that should be used to solve this challenge resource.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>issuerRef</code>
              <br />
              <em>
                <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
              </em>
            </td>
            <td>
              <p>IssuerRef references a properly configured ACME-type Issuer which should be used to create this Challenge. If the Issuer does not exist, processing will be retried. If the Issuer is not an &lsquo;ACME&rsquo; Issuer, an error will be returned and the Challenge will be marked as failed.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ChallengeStatus">ChallengeStatus</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.Order">Order</h3>
<div>
  <p>Order is a type to represent an Order with an ACME server</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>acme.cert-manager.io/v1alpha2</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>Order</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.OrderSpec">OrderSpec</a>
        </em>
      </td>
      <td>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>csr</code>
              <br />
              <em>[]byte</em>
            </td>
            <td>
              <p>Certificate signing request bytes in DER encoding. This will be used when finalizing the order. This field must be set on the order.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>issuerRef</code>
              <br />
              <em>
                <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
              </em>
            </td>
            <td>
              <p>IssuerRef references a properly configured ACME-type Issuer which should be used to create this Order. If the Issuer does not exist, processing will be retried. If the Issuer is not an &lsquo;ACME&rsquo; Issuer, an error will be returned and the Order will be marked as failed.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>commonName</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>CommonName is the common name as specified on the DER encoded CSR. If CommonName is not specified, the first DNSName specified will be used as the CommonName. At least one of CommonName or a DNSNames must be set. This field must match the corresponding field on the DER encoded CSR.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>dnsNames</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>DNSNames is a list of DNS names that should be included as part of the Order validation process. If CommonName is not specified, the first DNSName specified will be used as the CommonName. At least one of CommonName or a DNSNames must be set. This field must match the corresponding field on the DER encoded CSR.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.OrderStatus">OrderStatus</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEAuthorization">ACMEAuthorization</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.OrderStatus">OrderStatus</a>) </p>
<div>
  <p>ACMEAuthorization contains data returned from the ACME server on an authorization that must be completed in order validate a DNS name on an ACME Order resource.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>URL is the URL of the Authorization that must be completed</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>identifier</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Identifier is the DNS name to be validated as part of this authorization</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>wildcard</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Wildcard will be true if this authorization is for a wildcard DNS name. If this is true, the identifier will be the <em>non-wildcard</em> version of the DNS name. For example, if &lsquo;*.example.com&rsquo; is the DNS name being validated, this field will be &lsquo;true&rsquo; and the &lsquo;identifier&rsquo; field will be &lsquo;example.com&rsquo;. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>challenges</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEChallenge">[]ACMEChallenge</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Challenges specifies the challenge types offered by the ACME server. One of these challenge types will be selected when validating the DNS name and an appropriate Challenge resource will be created to perform the ACME challenge process.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEChallenge">ACMEChallenge</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEAuthorization">ACMEAuthorization</a>) </p>
<div>
  <p>Challenge specifies a challenge offered by the ACME server for an Order. An appropriate Challenge resource can be created to perform the ACME challenge process.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>URL is the URL of this challenge. It can be used to retrieve additional metadata about the Challenge from the ACME server.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>token</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Token is the token that must be presented for this challenge. This is used to compute the &lsquo;key&rsquo; that must also be presented.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>type</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeType">ACMEChallengeType</a>
        </em>
      </td>
      <td>
        <p>Type is the type of challenge being offered, e.g. http-01, dns-01</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEChallengeSolver">ACMEChallengeSolver</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuer">ACMEIssuer</a>, <a href="#acme.cert-manager.io/v1alpha2.ChallengeSpec">ChallengeSpec</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>selector</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.CertificateDNSNameSelector">CertificateDNSNameSelector</a>
        </em>
      </td>
      <td>
        <p>Selector selects a set of DNSNames on the Certificate resource that should be solved using this challenge solver.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>http01</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01">ACMEChallengeSolverHTTP01</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>dns01</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolver">ACMEChallengeSolver</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>cnameStrategy</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.CNAMEStrategy">CNAMEStrategy</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>CNAMEStrategy configures how the DNS01 provider should handle CNAME records when found in DNS zones.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>akamai</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderAkamai">ACMEIssuerDNS01ProviderAkamai</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>clouddns</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderCloudDNS">ACMEIssuerDNS01ProviderCloudDNS</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>cloudflare</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderCloudflare">ACMEIssuerDNS01ProviderCloudflare</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>route53</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderRoute53">ACMEIssuerDNS01ProviderRoute53</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>azuredns</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderAzureDNS">ACMEIssuerDNS01ProviderAzureDNS</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>digitalocean</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderDigitalOcean">ACMEIssuerDNS01ProviderDigitalOcean</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>acmedns</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderAcmeDNS">ACMEIssuerDNS01ProviderAcmeDNS</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>rfc2136</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderRFC2136">ACMEIssuerDNS01ProviderRFC2136</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>webhook</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderWebhook">ACMEIssuerDNS01ProviderWebhook</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01">ACMEChallengeSolverHTTP01</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolver">ACMEChallengeSolver</a>) </p>
<div>
  <p>ACMEChallengeSolverHTTP01 contains configuration detailing how to solve HTTP01 challenges within a Kubernetes cluster. Typically this is accomplished through creating &lsquo;routes&rsquo; of some description that configure ingress controllers to direct traffic to &lsquo;solver pods&rsquo;, which are responsible for responding to the ACME server&rsquo;s HTTP requests.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>ingress</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01Ingress">ACMEChallengeSolverHTTP01Ingress</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The ingress based HTTP01 challenge solver will solve challenges by creating or modifying Ingress resources in order to route requests for &lsquo;/.well-known/acme-challenge/XYZ&rsquo; to &lsquo;challenge solver&rsquo; pods that are provisioned by cert-manager for each Challenge to be completed.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01Ingress">ACMEChallengeSolverHTTP01Ingress</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01">ACMEChallengeSolverHTTP01</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>serviceType</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#servicetype-v1-core">Kubernetes core/v1.ServiceType</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Optional service type for Kubernetes solver service</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>class</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The ingress class to use when creating Ingress resources to solve ACME challenges that use this challenge solver. Only one of &lsquo;class&rsquo; or &lsquo;name&rsquo; may be specified.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>name</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The name of the ingress resource that should have ACME challenge solving routes inserted into it in order to solve HTTP01 challenges. This is typically used in conjunction with ingress controllers like ingress-gce, which maintains a 1:1 mapping between external IPs and ingress resources.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>podTemplate</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01IngressPodTemplate">ACMEChallengeSolverHTTP01IngressPodTemplate</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Optional pod template used to configure the ACME challenge solver pods used for HTTP01 challenges</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01IngressPodObjectMeta">ACMEChallengeSolverHTTP01IngressPodObjectMeta</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01IngressPodTemplate">ACMEChallengeSolverHTTP01IngressPodTemplate</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>annotations</code>
        <br />
        <em>map[string]string</em>
      </td>
      <td>
        <p>Annotations that should be added to the create ACME HTTP01 solver pods.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>labels</code>
        <br />
        <em>map[string]string</em>
      </td>
      <td>
        <p>Labels that should be added to the created ACME HTTP01 solver pods.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01IngressPodSpec">ACMEChallengeSolverHTTP01IngressPodSpec</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01IngressPodTemplate">ACMEChallengeSolverHTTP01IngressPodTemplate</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>nodeSelector</code>
        <br />
        <em>map[string]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> NodeSelector is a selector which must be true for the pod to fit on a node. Selector which must match a node&rsquo;s labels for the pod to be scheduled on that node. More info: <a href="https://kubernetes.io/docs/concepts/configuration/assign-pod-node/">https://kubernetes.io/docs/concepts/configuration/assign-pod-node/</a> </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>affinity</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#affinity-v1-core">Kubernetes core/v1.Affinity</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>If specified, the pod&rsquo;s scheduling constraints</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>tolerations</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#toleration-v1-core">[]Kubernetes core/v1.Toleration</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>If specified, the pod&rsquo;s tolerations.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01IngressPodTemplate">ACMEChallengeSolverHTTP01IngressPodTemplate</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01Ingress">ACMEChallengeSolverHTTP01Ingress</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01IngressPodObjectMeta">ACMEChallengeSolverHTTP01IngressPodObjectMeta</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>ObjectMeta overrides for the pod used to solve HTTP01 challenges. Only the &lsquo;labels&rsquo; and &lsquo;annotations&rsquo; fields may be set. If labels or annotations overlap with in-built values, the values here will override the in-built values.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01IngressPodSpec">ACMEChallengeSolverHTTP01IngressPodSpec</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>PodSpec defines overrides for the HTTP01 challenge solver pod. Only the &lsquo;nodeSelector&rsquo;, &lsquo;affinity&rsquo; and &lsquo;tolerations&rsquo; fields are supported currently. All other fields will be ignored.</p>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>nodeSelector</code>
              <br />
              <em>map[string]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> NodeSelector is a selector which must be true for the pod to fit on a node. Selector which must match a node&rsquo;s labels for the pod to be scheduled on that node. More info: <a href="https://kubernetes.io/docs/concepts/configuration/assign-pod-node/">https://kubernetes.io/docs/concepts/configuration/assign-pod-node/</a> </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>affinity</code>
              <br />
              <em>
                <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#affinity-v1-core">Kubernetes core/v1.Affinity</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>If specified, the pod&rsquo;s scheduling constraints</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>tolerations</code>
              <br />
              <em>
                <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#toleration-v1-core">[]Kubernetes core/v1.Toleration</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>If specified, the pod&rsquo;s tolerations.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEChallengeType"> ACMEChallengeType (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallenge">ACMEChallenge</a>, <a href="#acme.cert-manager.io/v1alpha2.ChallengeSpec">ChallengeSpec</a>) </p>
<div>
  <p>ACMEChallengeType denotes a type of ACME challenge</p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;dns-01&#34;</p>
      </td>
      <td>
        <p>ACMEChallengeTypeDNS01 denotes a Challenge is of type dns-01</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;http-01&#34;</p>
      </td>
      <td>
        <p>ACMEChallengeTypeHTTP01 denotes a Challenge is of type http-01</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEExternalAccountBinding">ACMEExternalAccountBinding</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuer">ACMEIssuer</a>) </p>
<div>
  <p>ACMEExternalAcccountBinding is a reference to a CA external account of the ACME server.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>keyID</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>keyID is the ID of the CA key that the External Account is bound to.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>keySecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p> keySecretRef is a Secret Key Selector referencing a data item in a Kubernetes Secret which holds the symmetric MAC key of the External Account Binding. The <code>key</code> is the index string that is paired with the key data in the Secret and should not be confused with the key data itself, or indeed with the External Account Binding keyID above. The secret key stored in the Secret <strong>must</strong> be un-padded, base64 URL encoded data. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>keyAlgorithm</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.HMACKeyAlgorithm">HMACKeyAlgorithm</a>
        </em>
      </td>
      <td>
        <p>keyAlgorithm is the MAC key algorithm that the key is used for. Valid values are &ldquo;HS256&rdquo;, &ldquo;HS384&rdquo; and &ldquo;HS512&rdquo;.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEIssuer">ACMEIssuer</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.IssuerConfig">IssuerConfig</a>) </p>
<div>
  <p>ACMEIssuer contains the specification for an ACME issuer</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>email</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Email is the email for this account</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>server</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Server is the ACME server URL</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>skipTLSVerify</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>If true, skip verifying the ACME server TLS certificate</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>externalAccountBinding</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEExternalAccountBinding">ACMEExternalAccountBinding</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>ExternalAcccountBinding is a reference to a CA external account of the ACME server.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>privateKeySecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p>PrivateKey is the name of a secret containing the private key for this user account.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>solvers</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolver">[]ACMEChallengeSolver</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Solvers is a list of challenge solvers that will be used to solve ACME challenges for the matching domains.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderAcmeDNS">ACMEIssuerDNS01ProviderAcmeDNS</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderAcmeDNS is a structure containing the configuration for ACME-DNS servers</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>host</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>accountSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderAkamai">ACMEIssuerDNS01ProviderAkamai</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderAkamai is a structure containing the DNS configuration for Akamai DNS—Zone Record Management API</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>serviceConsumerDomain</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>clientTokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>clientSecretSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>accessTokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderAzureDNS">ACMEIssuerDNS01ProviderAzureDNS</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderAzureDNS is a structure containing the configuration for Azure DNS</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>clientID</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>clientSecretSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>subscriptionID</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>tenantID</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>resourceGroupName</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>hostedZoneName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>environment</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.AzureDNSEnvironment">AzureDNSEnvironment</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderCloudDNS">ACMEIssuerDNS01ProviderCloudDNS</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderCloudDNS is a structure containing the DNS configuration for Google Cloud DNS</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>serviceAccountSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>project</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderCloudflare">ACMEIssuerDNS01ProviderCloudflare</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderCloudflare is a structure containing the DNS configuration for Cloudflare</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>email</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>apiKeySecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>apiTokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderDigitalOcean">ACMEIssuerDNS01ProviderDigitalOcean</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderDigitalOcean is a structure containing the DNS configuration for DigitalOcean Domains</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>tokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderRFC2136">ACMEIssuerDNS01ProviderRFC2136</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderRFC2136 is a structure containing the configuration for RFC2136 DNS</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>nameserver</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>The IP address of the DNS supporting RFC2136. Required. Note: FQDN is not a valid value, only IP.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>tsigSecretSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The name of the secret containing the TSIG value. If <code>tsigKeyName</code> is defined, this field is required. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>tsigKeyName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The TSIG Key name configured in the DNS. If <code>tsigSecretSecretRef</code> is defined, this field is required. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>tsigAlgorithm</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The TSIG Algorithm configured in the DNS supporting RFC2136. Used only when <code>tsigSecretSecretRef</code> and <code>tsigKeyName</code> are defined. Supported values are (case-insensitive): <code>HMACMD5</code> (default), <code>HMACSHA1</code>, <code>HMACSHA256</code> or <code>HMACSHA512</code>. </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderRoute53">ACMEIssuerDNS01ProviderRoute53</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderRoute53 is a structure containing the Route 53 configuration for AWS</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>accessKeyID</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The AccessKeyID is used for authentication. If not set we fall-back to using env vars, shared credentials file or AWS Instance metadata see: <a href="https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials">https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials</a> </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>secretAccessKeySecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>
          The SecretAccessKey is used for authentication. If not set we fall-back to using env vars, shared credentials file or AWS Instance metadata
          <a href="https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials">https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials</a>
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>role</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Role is a Role ARN which the Route53 provider will assume using either the explicit credentials AccessKeyID/SecretAccessKey or the inferred credentials from environment variables, shared credentials file or AWS Instance metadata</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>hostedZoneID</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>If set, the provider will manage only this zone in Route53 and will not do an lookup using the route53:ListHostedZonesByName api call.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>region</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Always set the region when using AccessKeyID and SecretAccessKey</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderWebhook">ACMEIssuerDNS01ProviderWebhook</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderWebhook specifies configuration for a webhook DNS01 provider, including where to POST ChallengePayload resources.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>groupName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>The API group name that should be used when POSTing ChallengePayload resources to the webhook apiserver. This should be the same as the GroupName specified in the webhook provider implementation.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>solverName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>The name of the solver to use, as defined in the webhook provider implementation. This will typically be the name of the provider, e.g. &lsquo;cloudflare&rsquo;.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>config</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#json-v1beta1-apiextensions">Kubernetes apiextensions/v1beta1.JSON</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Additional configuration that should be passed to the webhook apiserver when challenges are processed. This can contain arbitrary JSON data. Secret values should not be specified in this stanza. If secret values are needed (e.g. credentials for a DNS service), you should use a SecretKeySelector to reference a Secret resource. For details on the schema of this field, consult the webhook provider implementation&rsquo;s documentation.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEIssuerStatus">ACMEIssuerStatus</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.IssuerStatus">IssuerStatus</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>uri</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>URI is the unique account identifier, which can also be used to retrieve account details from the CA</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>lastRegisteredEmail</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>LastRegisteredEmail is the email associated with the latest registered ACME account, in order to track changes made to registered account associated with the Issuer</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.AzureDNSEnvironment"> AzureDNSEnvironment (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderAzureDNS">ACMEIssuerDNS01ProviderAzureDNS</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;AzureChinaCloud&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;AzureGermanCloud&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;AzurePublicCloud&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;AzureUSGovernmentCloud&#34;</p>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.CNAMEStrategy"> CNAMEStrategy (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>CNAMEStrategy configures how the DNS01 provider should handle CNAME records when found in DNS zones. By default, the None strategy will be applied (i.e. do not follow CNAMEs).</p>
</div>
<h3 id="acme.cert-manager.io/v1alpha2.CertificateDNSNameSelector">CertificateDNSNameSelector</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolver">ACMEChallengeSolver</a>) </p>
<div>
  <p>CertificateDomainSelector selects certificates using a label selector, and can optionally select individual DNS names within those certificates. If both MatchLabels and DNSNames are empty, this selector will match all certificates and DNS names within them.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>matchLabels</code>
        <br />
        <em>map[string]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>A label selector that is used to refine the set of certificate&rsquo;s that this challenge solver will apply to.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>dnsNames</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>List of DNSNames that this solver will be used to solve. If specified and a match is found, a dnsNames selector will take precedence over a dnsZones selector. If multiple solvers match with the same dnsNames value, the solver with the most matching labels in matchLabels will be selected. If neither has more matches, the solver defined earlier in the list will be selected.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>dnsZones</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>List of DNSZones that this solver will be used to solve. The most specific DNS zone match specified here will take precedence over other DNS zone matches, so a solver specifying sys.example.com will be selected over one specifying example.com for the domain www.sys.example.com. If multiple solvers match with the same dnsZones value, the solver with the most matching labels in matchLabels will be selected. If neither has more matches, the solver defined earlier in the list will be selected.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ChallengeSpec">ChallengeSpec</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.Challenge">Challenge</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>authzURL</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>AuthzURL is the URL to the ACME Authorization resource that this challenge is a part of.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>type</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeType">ACMEChallengeType</a>
        </em>
      </td>
      <td>
        <p>Type is the type of ACME challenge this resource represents, e.g. &ldquo;dns01&rdquo; or &ldquo;http01&rdquo;</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>URL is the URL of the ACME Challenge resource for this challenge. This can be used to lookup details about the status of this challenge.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>dnsName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>DNSName is the identifier that this challenge is for, e.g. example.com.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>token</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Token is the ACME challenge token for this challenge.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>key</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Key is the ACME challenge key for this challenge</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>wildcard</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Wildcard will be true if this challenge is for a wildcard identifier, for example &lsquo;*.example.com&rsquo;</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>solver</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolver">ACMEChallengeSolver</a>
        </em>
      </td>
      <td>
        <p>Solver contains the domain solving configuration that should be used to solve this challenge resource.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>issuerRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
        </em>
      </td>
      <td>
        <p>IssuerRef references a properly configured ACME-type Issuer which should be used to create this Challenge. If the Issuer does not exist, processing will be retried. If the Issuer is not an &lsquo;ACME&rsquo; Issuer, an error will be returned and the Challenge will be marked as failed.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ChallengeStatus">ChallengeStatus</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.Challenge">Challenge</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>processing</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Processing is used to denote whether this challenge should be processed or not. This field will only be set to true by the &lsquo;scheduling&rsquo; component. It will only be set to false by the &lsquo;challenges&rsquo; controller, after the challenge has reached a final state or timed out. If this field is set to false, the challenge controller will not take any more action.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>presented</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Presented will be set to true if the challenge values for this challenge are currently &lsquo;presented&rsquo;. This <em>does not</em> imply the self check is passing. Only that the values have been &lsquo;submitted&rsquo; for the appropriate challenge mechanism (i.e. the DNS01 TXT record has been presented, or the HTTP01 configuration has been configured). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>reason</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Reason contains human readable information on why the Challenge is in the current state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>state</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.State">State</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>State contains the current &lsquo;state&rsquo; of the challenge. If not set, the state of the challenge is unknown.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.HMACKeyAlgorithm"> HMACKeyAlgorithm (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEExternalAccountBinding">ACMEExternalAccountBinding</a>) </p>
<div>
  <p>HMACKeyAlgorithm is the name of a key algorithm used for HMAC encryption</p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;HS256&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;HS384&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;HS512&#34;</p>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.OrderSpec">OrderSpec</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.Order">Order</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>csr</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <p>Certificate signing request bytes in DER encoding. This will be used when finalizing the order. This field must be set on the order.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>issuerRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
        </em>
      </td>
      <td>
        <p>IssuerRef references a properly configured ACME-type Issuer which should be used to create this Order. If the Issuer does not exist, processing will be retried. If the Issuer is not an &lsquo;ACME&rsquo; Issuer, an error will be returned and the Order will be marked as failed.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>commonName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>CommonName is the common name as specified on the DER encoded CSR. If CommonName is not specified, the first DNSName specified will be used as the CommonName. At least one of CommonName or a DNSNames must be set. This field must match the corresponding field on the DER encoded CSR.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>dnsNames</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>DNSNames is a list of DNS names that should be included as part of the Order validation process. If CommonName is not specified, the first DNSName specified will be used as the CommonName. At least one of CommonName or a DNSNames must be set. This field must match the corresponding field on the DER encoded CSR.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.OrderStatus">OrderStatus</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.Order">Order</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>URL of the Order. This will initially be empty when the resource is first created. The Order controller will populate this field when the Order is first processed. This field will be immutable after it is initially set.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>finalizeURL</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>FinalizeURL of the Order. This is used to obtain certificates for this order once it has been completed.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>authorizations</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEAuthorization">[]ACMEAuthorization</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Authorizations contains data returned from the ACME server on what authoriations must be completed in order to validate the DNS names specified on the Order.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>certificate</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Certificate is a copy of the PEM encoded certificate for this Order. This field will be populated after the order has been successfully finalized with the ACME server, and the order has transitioned to the &lsquo;valid&rsquo; state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>state</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.State">State</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>State contains the current state of this Order resource. States &lsquo;success&rsquo; and &lsquo;expired&rsquo; are &lsquo;final&rsquo;</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>reason</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Reason optionally provides more information about a why the order is in the current state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>failureTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>FailureTime stores the time that this order failed. This is used to influence garbage collection and back-off.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.State"> State (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ChallengeStatus">ChallengeStatus</a>, <a href="#acme.cert-manager.io/v1alpha2.OrderStatus">OrderStatus</a>) </p>
<div>
  <p>
    State represents the state of an ACME resource, such as an Order. The possible options here map to the corresponding values in the ACME specification. Full details of these values can be found here: <a href="https://tools.ietf.org/html/draft-ietf-acme-acme-15#section-7.1.6">https://tools.ietf.org/html/draft-ietf-acme-acme-15#section-7.1.6</a>
    Clients utilising this type must also gracefully handle unknown values, as the contents of this enumeration may be added to over time.
  </p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;errored&#34;</p>
      </td>
      <td>
        <p>Errored signifies that the ACME resource has errored for some reason. This is a catch-all state, and is used for marking internal cert-manager errors such as validation failures. This is a final state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;expired&#34;</p>
      </td>
      <td>
        <p>Expired signifies that an ACME resource has expired. If an Order is marked &lsquo;Expired&rsquo;, one of its validations may have expired or the Order itself. This is a final state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;invalid&#34;</p>
      </td>
      <td>
        <p>Invalid signifies that an ACME resource is invalid for some reason. If an Order is marked &lsquo;invalid&rsquo;, one of its validations be have invalid for some reason. This is a final state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;pending&#34;</p>
      </td>
      <td>
        <p>Pending signifies that an ACME resource is still pending and is not yet ready. If an Order is marked &lsquo;Pending&rsquo;, the validations for that Order are still in progress. This is a transient state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;processing&#34;</p>
      </td>
      <td>
        <p>Processing signifies that an ACME resource is being processed by the server. If an Order is marked &lsquo;Processing&rsquo;, the validations for that Order are currently being processed. This is a transient state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;ready&#34;</p>
      </td>
      <td>
        <p>Ready signifies that an ACME resource is in a ready state. If an order is &lsquo;ready&rsquo;, all of its challenges have been completed successfully and the order is ready to be finalized. Once finalized, it will transition to the Valid state. This is a transient state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;&#34;</p>
      </td>
      <td>
        <p>Unknown is not a real state as part of the ACME spec. It is used to represent an unrecognised value.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;valid&#34;</p>
      </td>
      <td>
        <p>Valid signifies that an ACME resource is in a valid state. If an order is &lsquo;valid&rsquo;, it has been finalized with the ACME server and the certificate can be retrieved from the ACME server using the certificate URL stored in the Order&rsquo;s status subresource. This is a final state.</p>
      </td>
    </tr>
  </tbody>
</table>
<hr />
<h2 id="acme.cert-manager.io/v1alpha3">acme.cert-manager.io/v1alpha3</h2>
<div>
  <p>Package v1alpha3 is the v1alpha3 version of the API.</p>
</div>
Resource Types:
<ul>
  <li>
    <a href="#acme.cert-manager.io/v1alpha3.Challenge">Challenge</a>
  </li>
  <li>
    <a href="#acme.cert-manager.io/v1alpha3.Order">Order</a>
  </li>
</ul>
<h3 id="acme.cert-manager.io/v1alpha3.Challenge">Challenge</h3>
<div>
  <p>Challenge is a type to represent a Challenge request with an ACME server</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>acme.cert-manager.io/v1alpha3</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>Challenge</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ChallengeSpec">ChallengeSpec</a>
        </em>
      </td>
      <td>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>authzURL</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p>AuthzURL is the URL to the ACME Authorization resource that this challenge is a part of.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>type</code>
              <br />
              <em>
                <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeType">ACMEChallengeType</a>
              </em>
            </td>
            <td>
              <p>Type is the type of ACME challenge this resource represents, e.g. &ldquo;dns01&rdquo; or &ldquo;http01&rdquo;</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>url</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p>URL is the URL of the ACME Challenge resource for this challenge. This can be used to lookup details about the status of this challenge.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>dnsName</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p>DNSName is the identifier that this challenge is for, e.g. example.com.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>token</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p>Token is the ACME challenge token for this challenge.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>key</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p>Key is the ACME challenge key for this challenge</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>wildcard</code>
              <br />
              <em>bool</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>Wildcard will be true if this challenge is for a wildcard identifier, for example &lsquo;*.example.com&rsquo;</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>solver</code>
              <br />
              <em>
                <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolver">ACMEChallengeSolver</a>
              </em>
            </td>
            <td>
              <p>Solver contains the domain solving configuration that should be used to solve this challenge resource.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>issuerRef</code>
              <br />
              <em>
                <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
              </em>
            </td>
            <td>
              <p>IssuerRef references a properly configured ACME-type Issuer which should be used to create this Challenge. If the Issuer does not exist, processing will be retried. If the Issuer is not an &lsquo;ACME&rsquo; Issuer, an error will be returned and the Challenge will be marked as failed.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ChallengeStatus">ChallengeStatus</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.Order">Order</h3>
<div>
  <p>Order is a type to represent an Order with an ACME server</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>acme.cert-manager.io/v1alpha3</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>Order</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.OrderSpec">OrderSpec</a>
        </em>
      </td>
      <td>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>csr</code>
              <br />
              <em>[]byte</em>
            </td>
            <td>
              <p>Certificate signing request bytes in DER encoding. This will be used when finalizing the order. This field must be set on the order.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>issuerRef</code>
              <br />
              <em>
                <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
              </em>
            </td>
            <td>
              <p>IssuerRef references a properly configured ACME-type Issuer which should be used to create this Order. If the Issuer does not exist, processing will be retried. If the Issuer is not an &lsquo;ACME&rsquo; Issuer, an error will be returned and the Order will be marked as failed.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>commonName</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>CommonName is the common name as specified on the DER encoded CSR. If CommonName is not specified, the first DNSName specified will be used as the CommonName. At least one of CommonName or a DNSNames must be set. This field must match the corresponding field on the DER encoded CSR.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>dnsNames</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>DNSNames is a list of DNS names that should be included as part of the Order validation process. If CommonName is not specified, the first DNSName specified will be used as the CommonName. At least one of CommonName or a DNSNames must be set. This field must match the corresponding field on the DER encoded CSR.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.OrderStatus">OrderStatus</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEAuthorization">ACMEAuthorization</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.OrderStatus">OrderStatus</a>) </p>
<div>
  <p>ACMEAuthorization contains data returned from the ACME server on an authorization that must be completed in order validate a DNS name on an ACME Order resource.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>URL is the URL of the Authorization that must be completed</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>identifier</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Identifier is the DNS name to be validated as part of this authorization</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>wildcard</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Wildcard will be true if this authorization is for a wildcard DNS name. If this is true, the identifier will be the <em>non-wildcard</em> version of the DNS name. For example, if &lsquo;*.example.com&rsquo; is the DNS name being validated, this field will be &lsquo;true&rsquo; and the &lsquo;identifier&rsquo; field will be &lsquo;example.com&rsquo;. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>challenges</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEChallenge">[]ACMEChallenge</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Challenges specifies the challenge types offered by the ACME server. One of these challenge types will be selected when validating the DNS name and an appropriate Challenge resource will be created to perform the ACME challenge process.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEChallenge">ACMEChallenge</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEAuthorization">ACMEAuthorization</a>) </p>
<div>
  <p>Challenge specifies a challenge offered by the ACME server for an Order. An appropriate Challenge resource can be created to perform the ACME challenge process.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>URL is the URL of this challenge. It can be used to retrieve additional metadata about the Challenge from the ACME server.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>token</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Token is the token that must be presented for this challenge. This is used to compute the &lsquo;key&rsquo; that must also be presented.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>type</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeType">ACMEChallengeType</a>
        </em>
      </td>
      <td>
        <p>Type is the type of challenge being offered, e.g. http-01, dns-01</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEChallengeSolver">ACMEChallengeSolver</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuer">ACMEIssuer</a>, <a href="#acme.cert-manager.io/v1alpha3.ChallengeSpec">ChallengeSpec</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>selector</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.CertificateDNSNameSelector">CertificateDNSNameSelector</a>
        </em>
      </td>
      <td>
        <p>Selector selects a set of DNSNames on the Certificate resource that should be solved using this challenge solver.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>http01</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverHTTP01">ACMEChallengeSolverHTTP01</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>dns01</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolver">ACMEChallengeSolver</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>cnameStrategy</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.CNAMEStrategy">CNAMEStrategy</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>CNAMEStrategy configures how the DNS01 provider should handle CNAME records when found in DNS zones.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>akamai</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderAkamai">ACMEIssuerDNS01ProviderAkamai</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>clouddns</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderCloudDNS">ACMEIssuerDNS01ProviderCloudDNS</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>cloudflare</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderCloudflare">ACMEIssuerDNS01ProviderCloudflare</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>route53</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderRoute53">ACMEIssuerDNS01ProviderRoute53</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>azuredns</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderAzureDNS">ACMEIssuerDNS01ProviderAzureDNS</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>digitalocean</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderDigitalOcean">ACMEIssuerDNS01ProviderDigitalOcean</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>acmedns</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderAcmeDNS">ACMEIssuerDNS01ProviderAcmeDNS</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>rfc2136</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderRFC2136">ACMEIssuerDNS01ProviderRFC2136</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>webhook</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderWebhook">ACMEIssuerDNS01ProviderWebhook</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEChallengeSolverHTTP01">ACMEChallengeSolverHTTP01</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolver">ACMEChallengeSolver</a>) </p>
<div>
  <p>ACMEChallengeSolverHTTP01 contains configuration detailing how to solve HTTP01 challenges within a Kubernetes cluster. Typically this is accomplished through creating &lsquo;routes&rsquo; of some description that configure ingress controllers to direct traffic to &lsquo;solver pods&rsquo;, which are responsible for responding to the ACME server&rsquo;s HTTP requests.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>ingress</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverHTTP01Ingress">ACMEChallengeSolverHTTP01Ingress</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The ingress based HTTP01 challenge solver will solve challenges by creating or modifying Ingress resources in order to route requests for &lsquo;/.well-known/acme-challenge/XYZ&rsquo; to &lsquo;challenge solver&rsquo; pods that are provisioned by cert-manager for each Challenge to be completed.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEChallengeSolverHTTP01Ingress">ACMEChallengeSolverHTTP01Ingress</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverHTTP01">ACMEChallengeSolverHTTP01</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>serviceType</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#servicetype-v1-core">Kubernetes core/v1.ServiceType</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Optional service type for Kubernetes solver service</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>class</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The ingress class to use when creating Ingress resources to solve ACME challenges that use this challenge solver. Only one of &lsquo;class&rsquo; or &lsquo;name&rsquo; may be specified.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>name</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The name of the ingress resource that should have ACME challenge solving routes inserted into it in order to solve HTTP01 challenges. This is typically used in conjunction with ingress controllers like ingress-gce, which maintains a 1:1 mapping between external IPs and ingress resources.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>podTemplate</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverHTTP01IngressPodTemplate">ACMEChallengeSolverHTTP01IngressPodTemplate</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Optional pod template used to configure the ACME challenge solver pods used for HTTP01 challenges</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEChallengeSolverHTTP01IngressPodObjectMeta">ACMEChallengeSolverHTTP01IngressPodObjectMeta</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverHTTP01IngressPodTemplate">ACMEChallengeSolverHTTP01IngressPodTemplate</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>annotations</code>
        <br />
        <em>map[string]string</em>
      </td>
      <td>
        <p>Annotations that should be added to the create ACME HTTP01 solver pods.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>labels</code>
        <br />
        <em>map[string]string</em>
      </td>
      <td>
        <p>Labels that should be added to the created ACME HTTP01 solver pods.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEChallengeSolverHTTP01IngressPodSpec">ACMEChallengeSolverHTTP01IngressPodSpec</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverHTTP01IngressPodTemplate">ACMEChallengeSolverHTTP01IngressPodTemplate</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>nodeSelector</code>
        <br />
        <em>map[string]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> NodeSelector is a selector which must be true for the pod to fit on a node. Selector which must match a node&rsquo;s labels for the pod to be scheduled on that node. More info: <a href="https://kubernetes.io/docs/concepts/configuration/assign-pod-node/">https://kubernetes.io/docs/concepts/configuration/assign-pod-node/</a> </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>affinity</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#affinity-v1-core">Kubernetes core/v1.Affinity</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>If specified, the pod&rsquo;s scheduling constraints</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>tolerations</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#toleration-v1-core">[]Kubernetes core/v1.Toleration</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>If specified, the pod&rsquo;s tolerations.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEChallengeSolverHTTP01IngressPodTemplate">ACMEChallengeSolverHTTP01IngressPodTemplate</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverHTTP01Ingress">ACMEChallengeSolverHTTP01Ingress</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverHTTP01IngressPodObjectMeta">ACMEChallengeSolverHTTP01IngressPodObjectMeta</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>ObjectMeta overrides for the pod used to solve HTTP01 challenges. Only the &lsquo;labels&rsquo; and &lsquo;annotations&rsquo; fields may be set. If labels or annotations overlap with in-built values, the values here will override the in-built values.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverHTTP01IngressPodSpec">ACMEChallengeSolverHTTP01IngressPodSpec</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>PodSpec defines overrides for the HTTP01 challenge solver pod. Only the &lsquo;nodeSelector&rsquo;, &lsquo;affinity&rsquo; and &lsquo;tolerations&rsquo; fields are supported currently. All other fields will be ignored.</p>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>nodeSelector</code>
              <br />
              <em>map[string]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> NodeSelector is a selector which must be true for the pod to fit on a node. Selector which must match a node&rsquo;s labels for the pod to be scheduled on that node. More info: <a href="https://kubernetes.io/docs/concepts/configuration/assign-pod-node/">https://kubernetes.io/docs/concepts/configuration/assign-pod-node/</a> </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>affinity</code>
              <br />
              <em>
                <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#affinity-v1-core">Kubernetes core/v1.Affinity</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>If specified, the pod&rsquo;s scheduling constraints</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>tolerations</code>
              <br />
              <em>
                <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#toleration-v1-core">[]Kubernetes core/v1.Toleration</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>If specified, the pod&rsquo;s tolerations.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEChallengeType"> ACMEChallengeType (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallenge">ACMEChallenge</a>, <a href="#acme.cert-manager.io/v1alpha3.ChallengeSpec">ChallengeSpec</a>) </p>
<div>
  <p>ACMEChallengeType denotes a type of ACME challenge</p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;dns-01&#34;</p>
      </td>
      <td>
        <p>ACMEChallengeTypeDNS01 denotes a Challenge is of type dns-01</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;http-01&#34;</p>
      </td>
      <td>
        <p>ACMEChallengeTypeHTTP01 denotes a Challenge is of type http-01</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEExternalAccountBinding">ACMEExternalAccountBinding</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuer">ACMEIssuer</a>) </p>
<div>
  <p>ACMEExternalAcccountBinding is a reference to a CA external account of the ACME server.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>keyID</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>keyID is the ID of the CA key that the External Account is bound to.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>keySecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p> keySecretRef is a Secret Key Selector referencing a data item in a Kubernetes Secret which holds the symmetric MAC key of the External Account Binding. The <code>key</code> is the index string that is paired with the key data in the Secret and should not be confused with the key data itself, or indeed with the External Account Binding keyID above. The secret key stored in the Secret <strong>must</strong> be un-padded, base64 URL encoded data. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>keyAlgorithm</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.HMACKeyAlgorithm">HMACKeyAlgorithm</a>
        </em>
      </td>
      <td>
        <p>keyAlgorithm is the MAC key algorithm that the key is used for. Valid values are &ldquo;HS256&rdquo;, &ldquo;HS384&rdquo; and &ldquo;HS512&rdquo;.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEIssuer">ACMEIssuer</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.IssuerConfig">IssuerConfig</a>) </p>
<div>
  <p>ACMEIssuer contains the specification for an ACME issuer</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>email</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Email is the email for this account</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>server</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Server is the ACME server URL</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>skipTLSVerify</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>If true, skip verifying the ACME server TLS certificate</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>externalAccountBinding</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEExternalAccountBinding">ACMEExternalAccountBinding</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>ExternalAcccountBinding is a reference to a CA external account of the ACME server.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>privateKeySecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p>PrivateKey is the name of a secret containing the private key for this user account.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>solvers</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolver">[]ACMEChallengeSolver</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Solvers is a list of challenge solvers that will be used to solve ACME challenges for the matching domains.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderAcmeDNS">ACMEIssuerDNS01ProviderAcmeDNS</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderAcmeDNS is a structure containing the configuration for ACME-DNS servers</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>host</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>accountSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderAkamai">ACMEIssuerDNS01ProviderAkamai</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderAkamai is a structure containing the DNS configuration for Akamai DNS—Zone Record Management API</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>serviceConsumerDomain</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>clientTokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>clientSecretSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>accessTokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderAzureDNS">ACMEIssuerDNS01ProviderAzureDNS</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderAzureDNS is a structure containing the configuration for Azure DNS</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>clientID</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>clientSecretSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>subscriptionID</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>tenantID</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>resourceGroupName</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>hostedZoneName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>environment</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.AzureDNSEnvironment">AzureDNSEnvironment</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderCloudDNS">ACMEIssuerDNS01ProviderCloudDNS</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderCloudDNS is a structure containing the DNS configuration for Google Cloud DNS</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>serviceAccountSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>project</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderCloudflare">ACMEIssuerDNS01ProviderCloudflare</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderCloudflare is a structure containing the DNS configuration for Cloudflare</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>email</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>apiKeySecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>apiTokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderDigitalOcean">ACMEIssuerDNS01ProviderDigitalOcean</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderDigitalOcean is a structure containing the DNS configuration for DigitalOcean Domains</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>tokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderRFC2136">ACMEIssuerDNS01ProviderRFC2136</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderRFC2136 is a structure containing the configuration for RFC2136 DNS</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>nameserver</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>The IP address of the DNS supporting RFC2136. Required. Note: FQDN is not a valid value, only IP.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>tsigSecretSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The name of the secret containing the TSIG value. If <code>tsigKeyName</code> is defined, this field is required. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>tsigKeyName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The TSIG Key name configured in the DNS. If <code>tsigSecretSecretRef</code> is defined, this field is required. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>tsigAlgorithm</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The TSIG Algorithm configured in the DNS supporting RFC2136. Used only when <code>tsigSecretSecretRef</code> and <code>tsigKeyName</code> are defined. Supported values are (case-insensitive): <code>HMACMD5</code> (default), <code>HMACSHA1</code>, <code>HMACSHA256</code> or <code>HMACSHA512</code>. </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderRoute53">ACMEIssuerDNS01ProviderRoute53</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderRoute53 is a structure containing the Route 53 configuration for AWS</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>accessKeyID</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The AccessKeyID is used for authentication. If not set we fall-back to using env vars, shared credentials file or AWS Instance metadata see: <a href="https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials">https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials</a> </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>secretAccessKeySecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>
          The SecretAccessKey is used for authentication. If not set we fall-back to using env vars, shared credentials file or AWS Instance metadata
          <a href="https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials">https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials</a>
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>role</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Role is a Role ARN which the Route53 provider will assume using either the explicit credentials AccessKeyID/SecretAccessKey or the inferred credentials from environment variables, shared credentials file or AWS Instance metadata</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>hostedZoneID</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>If set, the provider will manage only this zone in Route53 and will not do an lookup using the route53:ListHostedZonesByName api call.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>region</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Always set the region when using AccessKeyID and SecretAccessKey</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderWebhook">ACMEIssuerDNS01ProviderWebhook</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderWebhook specifies configuration for a webhook DNS01 provider, including where to POST ChallengePayload resources.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>groupName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>The API group name that should be used when POSTing ChallengePayload resources to the webhook apiserver. This should be the same as the GroupName specified in the webhook provider implementation.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>solverName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>The name of the solver to use, as defined in the webhook provider implementation. This will typically be the name of the provider, e.g. &lsquo;cloudflare&rsquo;.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>config</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#json-v1beta1-apiextensions">Kubernetes apiextensions/v1beta1.JSON</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Additional configuration that should be passed to the webhook apiserver when challenges are processed. This can contain arbitrary JSON data. Secret values should not be specified in this stanza. If secret values are needed (e.g. credentials for a DNS service), you should use a SecretKeySelector to reference a Secret resource. For details on the schema of this field, consult the webhook provider implementation&rsquo;s documentation.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEIssuerStatus">ACMEIssuerStatus</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.IssuerStatus">IssuerStatus</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>uri</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>URI is the unique account identifier, which can also be used to retrieve account details from the CA</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>lastRegisteredEmail</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>LastRegisteredEmail is the email associated with the latest registered ACME account, in order to track changes made to registered account associated with the Issuer</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.AzureDNSEnvironment"> AzureDNSEnvironment (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderAzureDNS">ACMEIssuerDNS01ProviderAzureDNS</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;AzureChinaCloud&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;AzureGermanCloud&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;AzurePublicCloud&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;AzureUSGovernmentCloud&#34;</p>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.CNAMEStrategy"> CNAMEStrategy (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>CNAMEStrategy configures how the DNS01 provider should handle CNAME records when found in DNS zones. By default, the None strategy will be applied (i.e. do not follow CNAMEs).</p>
</div>
<h3 id="acme.cert-manager.io/v1alpha3.CertificateDNSNameSelector">CertificateDNSNameSelector</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolver">ACMEChallengeSolver</a>) </p>
<div>
  <p>CertificateDomainSelector selects certificates using a label selector, and can optionally select individual DNS names within those certificates. If both MatchLabels and DNSNames are empty, this selector will match all certificates and DNS names within them.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>matchLabels</code>
        <br />
        <em>map[string]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>A label selector that is used to refine the set of certificate&rsquo;s that this challenge solver will apply to.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>dnsNames</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>List of DNSNames that this solver will be used to solve. If specified and a match is found, a dnsNames selector will take precedence over a dnsZones selector. If multiple solvers match with the same dnsNames value, the solver with the most matching labels in matchLabels will be selected. If neither has more matches, the solver defined earlier in the list will be selected.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>dnsZones</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>List of DNSZones that this solver will be used to solve. The most specific DNS zone match specified here will take precedence over other DNS zone matches, so a solver specifying sys.example.com will be selected over one specifying example.com for the domain www.sys.example.com. If multiple solvers match with the same dnsZones value, the solver with the most matching labels in matchLabels will be selected. If neither has more matches, the solver defined earlier in the list will be selected.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ChallengeSpec">ChallengeSpec</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.Challenge">Challenge</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>authzURL</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>AuthzURL is the URL to the ACME Authorization resource that this challenge is a part of.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>type</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeType">ACMEChallengeType</a>
        </em>
      </td>
      <td>
        <p>Type is the type of ACME challenge this resource represents, e.g. &ldquo;dns01&rdquo; or &ldquo;http01&rdquo;</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>URL is the URL of the ACME Challenge resource for this challenge. This can be used to lookup details about the status of this challenge.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>dnsName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>DNSName is the identifier that this challenge is for, e.g. example.com.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>token</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Token is the ACME challenge token for this challenge.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>key</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Key is the ACME challenge key for this challenge</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>wildcard</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Wildcard will be true if this challenge is for a wildcard identifier, for example &lsquo;*.example.com&rsquo;</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>solver</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolver">ACMEChallengeSolver</a>
        </em>
      </td>
      <td>
        <p>Solver contains the domain solving configuration that should be used to solve this challenge resource.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>issuerRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
        </em>
      </td>
      <td>
        <p>IssuerRef references a properly configured ACME-type Issuer which should be used to create this Challenge. If the Issuer does not exist, processing will be retried. If the Issuer is not an &lsquo;ACME&rsquo; Issuer, an error will be returned and the Challenge will be marked as failed.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ChallengeStatus">ChallengeStatus</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.Challenge">Challenge</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>processing</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Processing is used to denote whether this challenge should be processed or not. This field will only be set to true by the &lsquo;scheduling&rsquo; component. It will only be set to false by the &lsquo;challenges&rsquo; controller, after the challenge has reached a final state or timed out. If this field is set to false, the challenge controller will not take any more action.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>presented</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Presented will be set to true if the challenge values for this challenge are currently &lsquo;presented&rsquo;. This <em>does not</em> imply the self check is passing. Only that the values have been &lsquo;submitted&rsquo; for the appropriate challenge mechanism (i.e. the DNS01 TXT record has been presented, or the HTTP01 configuration has been configured). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>reason</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Reason contains human readable information on why the Challenge is in the current state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>state</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.State">State</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>State contains the current &lsquo;state&rsquo; of the challenge. If not set, the state of the challenge is unknown.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.HMACKeyAlgorithm"> HMACKeyAlgorithm (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEExternalAccountBinding">ACMEExternalAccountBinding</a>) </p>
<div>
  <p>HMACKeyAlgorithm is the name of a key algorithm used for HMAC encryption</p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;HS256&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;HS384&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;HS512&#34;</p>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.OrderSpec">OrderSpec</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.Order">Order</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>csr</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <p>Certificate signing request bytes in DER encoding. This will be used when finalizing the order. This field must be set on the order.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>issuerRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
        </em>
      </td>
      <td>
        <p>IssuerRef references a properly configured ACME-type Issuer which should be used to create this Order. If the Issuer does not exist, processing will be retried. If the Issuer is not an &lsquo;ACME&rsquo; Issuer, an error will be returned and the Order will be marked as failed.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>commonName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>CommonName is the common name as specified on the DER encoded CSR. If CommonName is not specified, the first DNSName specified will be used as the CommonName. At least one of CommonName or a DNSNames must be set. This field must match the corresponding field on the DER encoded CSR.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>dnsNames</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>DNSNames is a list of DNS names that should be included as part of the Order validation process. If CommonName is not specified, the first DNSName specified will be used as the CommonName. At least one of CommonName or a DNSNames must be set. This field must match the corresponding field on the DER encoded CSR.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.OrderStatus">OrderStatus</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.Order">Order</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>URL of the Order. This will initially be empty when the resource is first created. The Order controller will populate this field when the Order is first processed. This field will be immutable after it is initially set.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>finalizeURL</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>FinalizeURL of the Order. This is used to obtain certificates for this order once it has been completed.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>authorizations</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEAuthorization">[]ACMEAuthorization</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Authorizations contains data returned from the ACME server on what authoriations must be completed in order to validate the DNS names specified on the Order.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>certificate</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Certificate is a copy of the PEM encoded certificate for this Order. This field will be populated after the order has been successfully finalized with the ACME server, and the order has transitioned to the &lsquo;valid&rsquo; state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>state</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.State">State</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>State contains the current state of this Order resource. States &lsquo;success&rsquo; and &lsquo;expired&rsquo; are &lsquo;final&rsquo;</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>reason</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Reason optionally provides more information about a why the order is in the current state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>failureTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>FailureTime stores the time that this order failed. This is used to influence garbage collection and back-off.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.State"> State (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ChallengeStatus">ChallengeStatus</a>, <a href="#acme.cert-manager.io/v1alpha3.OrderStatus">OrderStatus</a>) </p>
<div>
  <p>
    State represents the state of an ACME resource, such as an Order. The possible options here map to the corresponding values in the ACME specification. Full details of these values can be found here: <a href="https://tools.ietf.org/html/draft-ietf-acme-acme-15#section-7.1.6">https://tools.ietf.org/html/draft-ietf-acme-acme-15#section-7.1.6</a>
    Clients utilising this type must also gracefully handle unknown values, as the contents of this enumeration may be added to over time.
  </p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;errored&#34;</p>
      </td>
      <td>
        <p>Errored signifies that the ACME resource has errored for some reason. This is a catch-all state, and is used for marking internal cert-manager errors such as validation failures. This is a final state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;expired&#34;</p>
      </td>
      <td>
        <p>Expired signifies that an ACME resource has expired. If an Order is marked &lsquo;Expired&rsquo;, one of its validations may have expired or the Order itself. This is a final state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;invalid&#34;</p>
      </td>
      <td>
        <p>Invalid signifies that an ACME resource is invalid for some reason. If an Order is marked &lsquo;invalid&rsquo;, one of its validations be have invalid for some reason. This is a final state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;pending&#34;</p>
      </td>
      <td>
        <p>Pending signifies that an ACME resource is still pending and is not yet ready. If an Order is marked &lsquo;Pending&rsquo;, the validations for that Order are still in progress. This is a transient state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;processing&#34;</p>
      </td>
      <td>
        <p>Processing signifies that an ACME resource is being processed by the server. If an Order is marked &lsquo;Processing&rsquo;, the validations for that Order are currently being processed. This is a transient state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;ready&#34;</p>
      </td>
      <td>
        <p>Ready signifies that an ACME resource is in a ready state. If an order is &lsquo;ready&rsquo;, all of its challenges have been completed successfully and the order is ready to be finalized. Once finalized, it will transition to the Valid state. This is a transient state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;&#34;</p>
      </td>
      <td>
        <p>Unknown is not a real state as part of the ACME spec. It is used to represent an unrecognised value.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;valid&#34;</p>
      </td>
      <td>
        <p>Valid signifies that an ACME resource is in a valid state. If an order is &lsquo;valid&rsquo;, it has been finalized with the ACME server and the certificate can be retrieved from the ACME server using the certificate URL stored in the Order&rsquo;s status subresource. This is a final state.</p>
      </td>
    </tr>
  </tbody>
</table>
<hr />
<h2 id="cert-manager.io/v1alpha2">cert-manager.io/v1alpha2</h2>
<div>
  <p>Package v1alpha2 is the v1alpha2 version of the API.</p>
</div>
Resource Types:
<ul>
  <li>
    <a href="#cert-manager.io/v1alpha2.Certificate">Certificate</a>
  </li>
  <li>
    <a href="#cert-manager.io/v1alpha2.CertificateRequest">CertificateRequest</a>
  </li>
  <li>
    <a href="#cert-manager.io/v1alpha2.ClusterIssuer">ClusterIssuer</a>
  </li>
  <li>
    <a href="#cert-manager.io/v1alpha2.Issuer">Issuer</a>
  </li>
</ul>
<h3 id="cert-manager.io/v1alpha2.Certificate">Certificate</h3>
<div>
  <p>Certificate is a type to represent a Certificate from ACME</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>cert-manager.io/v1alpha2</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>Certificate</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.CertificateSpec">CertificateSpec</a>
        </em>
      </td>
      <td>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>subject</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1alpha2.X509Subject">X509Subject</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> Full X509 name specification (<a href="https://golang.org/pkg/crypto/x509/pkix/#Name">https://golang.org/pkg/crypto/x509/pkix/#Name</a>). </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>commonName</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>CommonName is a common name to be used on the Certificate. The CommonName should have a length of 64 characters or fewer to avoid generating invalid CSRs.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>organization</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>Organization is the organization to be used on the Certificate</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>duration</code>
              <br />
              <em>
                <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>Certificate default Duration</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>renewBefore</code>
              <br />
              <em>
                <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>Certificate renew before expiration duration</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>dnsNames</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>DNSNames is a list of subject alt names to be used on the Certificate.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>ipAddresses</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>IPAddresses is a list of IP addresses to be used on the Certificate</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>uriSANs</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>URISANs is a list of URI Subject Alternative Names to be set on this Certificate.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>secretName</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p>SecretName is the name of the secret resource to store this secret in</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>issuerRef</code>
              <br />
              <em>
                <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
              </em>
            </td>
            <td>
              <p>IssuerRef is a reference to the issuer for this certificate. If the &lsquo;kind&rsquo; field is not set, or set to &lsquo;Issuer&rsquo;, an Issuer resource with the given name in the same namespace as the Certificate will be used. If the &lsquo;kind&rsquo; field is set to &lsquo;ClusterIssuer&rsquo;, a ClusterIssuer with the provided name will be used. The &lsquo;name&rsquo; field in this stanza is required at all times.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>isCA</code>
              <br />
              <em>bool</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>IsCA will mark this Certificate as valid for signing. This implies that the &lsquo;cert sign&rsquo; usage is set</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>usages</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1alpha2.KeyUsage">[]KeyUsage</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>Usages is the set of x509 actions that are enabled for a given key. Defaults are (&lsquo;digital signature&rsquo;, &lsquo;key encipherment&rsquo;) if empty</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>keySize</code>
              <br />
              <em>int</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>KeySize is the key bit size of the corresponding private key for this certificate. If provided, value must be between 2048 and 8192 inclusive when KeyAlgorithm is empty or is set to &ldquo;rsa&rdquo;, and value must be one of (256, 384, 521) when KeyAlgorithm is set to &ldquo;ecdsa&rdquo;.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>keyAlgorithm</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1alpha2.KeyAlgorithm">KeyAlgorithm</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>KeyAlgorithm is the private key algorithm of the corresponding private key for this certificate. If provided, allowed values are either &ldquo;rsa&rdquo; or &ldquo;ecdsa&rdquo; If KeyAlgorithm is specified and KeySize is not provided, key size of 256 will be used for &ldquo;ecdsa&rdquo; key algorithm and key size of 2048 will be used for &ldquo;rsa&rdquo; key algorithm.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>keyEncoding</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1alpha2.KeyEncoding">KeyEncoding</a>
              </em>
            </td>
            <td>
              <p>KeyEncoding is the private key cryptography standards (PKCS) for this certificate&rsquo;s private key to be encoded in. If provided, allowed values are &ldquo;pkcs1&rdquo; and &ldquo;pkcs8&rdquo; standing for PKCS#1 and PKCS#8, respectively. If KeyEncoding is not specified, then PKCS#1 will be used by default.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.CertificateStatus">CertificateStatus</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.CertificateRequest">CertificateRequest</h3>
<div>
  <p>CertificateRequest is a type to represent a Certificate Signing Request</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>cert-manager.io/v1alpha2</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>CertificateRequest</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.CertificateRequestSpec">CertificateRequestSpec</a>
        </em>
      </td>
      <td>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>duration</code>
              <br />
              <em>
                <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>Requested certificate default Duration</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>issuerRef</code>
              <br />
              <em>
                <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
              </em>
            </td>
            <td>
              <p>IssuerRef is a reference to the issuer for this CertificateRequest. If the &lsquo;kind&rsquo; field is not set, or set to &lsquo;Issuer&rsquo;, an Issuer resource with the given name in the same namespace as the CertificateRequest will be used. If the &lsquo;kind&rsquo; field is set to &lsquo;ClusterIssuer&rsquo;, a ClusterIssuer with the provided name will be used. The &lsquo;name&rsquo; field in this stanza is required at all times. The group field refers to the API group of the issuer which defaults to &lsquo;cert-manager.io&rsquo; if empty.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>csr</code>
              <br />
              <em>[]byte</em>
            </td>
            <td>
              <p>Byte slice containing the PEM encoded CertificateSigningRequest</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>isCA</code>
              <br />
              <em>bool</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>IsCA will mark the resulting certificate as valid for signing. This implies that the &lsquo;cert sign&rsquo; usage is set</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>usages</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1alpha2.KeyUsage">[]KeyUsage</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>Usages is the set of x509 actions that are enabled for a given key. Defaults are (&lsquo;digital signature&rsquo;, &lsquo;key encipherment&rsquo;) if empty</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.CertificateRequestStatus">CertificateRequestStatus</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.ClusterIssuer">ClusterIssuer</h3>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>cert-manager.io/v1alpha2</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>ClusterIssuer</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.IssuerSpec">IssuerSpec</a>
        </em>
      </td>
      <td>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>IssuerConfig</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1alpha2.IssuerConfig">IssuerConfig</a>
              </em>
            </td>
            <td>
              <p> (Members of <code>IssuerConfig</code> are embedded into this type.) </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.IssuerStatus">IssuerStatus</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.Issuer">Issuer</h3>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>cert-manager.io/v1alpha2</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>Issuer</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.IssuerSpec">IssuerSpec</a>
        </em>
      </td>
      <td>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>IssuerConfig</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1alpha2.IssuerConfig">IssuerConfig</a>
              </em>
            </td>
            <td>
              <p> (Members of <code>IssuerConfig</code> are embedded into this type.) </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.IssuerStatus">IssuerStatus</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.CAIssuer">CAIssuer</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.IssuerConfig">IssuerConfig</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>secretName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>SecretName is the name of the secret used to sign Certificates issued by this Issuer.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.CertificateCondition">CertificateCondition</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.CertificateStatus">CertificateStatus</a>) </p>
<div>
  <p>CertificateCondition contains condition information for an Certificate.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>type</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.CertificateConditionType">CertificateConditionType</a>
        </em>
      </td>
      <td>
        <p>Type of the condition, currently (&lsquo;Ready&rsquo;).</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ConditionStatus">ConditionStatus</a>
        </em>
      </td>
      <td>
        <p>Status of the condition, one of (&lsquo;True&rsquo;, &lsquo;False&rsquo;, &lsquo;Unknown&rsquo;).</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>lastTransitionTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>LastTransitionTime is the timestamp corresponding to the last status change of this condition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>reason</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Reason is a brief machine readable explanation for the condition&rsquo;s last transition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>message</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Message is a human readable description of the details of the last transition, complementing reason.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.CertificateConditionType"> CertificateConditionType (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.CertificateCondition">CertificateCondition</a>) </p>
<div>
  <p>CertificateConditionType represents an Certificate condition value.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;Ready&#34;</p>
      </td>
      <td>
        <p>CertificateConditionReady indicates that a certificate is ready for use. This is defined as: - The target secret exists - The target secret contains a certificate that has not expired - The target secret contains a private key valid for the certificate - The commonName and dnsNames attributes match those specified on the Certificate</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.CertificateRequestCondition">CertificateRequestCondition</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.CertificateRequestStatus">CertificateRequestStatus</a>) </p>
<div>
  <p>CertificateRequestCondition contains condition information for a CertificateRequest.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>type</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.CertificateRequestConditionType">CertificateRequestConditionType</a>
        </em>
      </td>
      <td>
        <p>Type of the condition, currently (&lsquo;Ready&rsquo;, &lsquo;InvalidRequest&rsquo;).</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ConditionStatus">ConditionStatus</a>
        </em>
      </td>
      <td>
        <p>Status of the condition, one of (&lsquo;True&rsquo;, &lsquo;False&rsquo;, &lsquo;Unknown&rsquo;).</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>lastTransitionTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>LastTransitionTime is the timestamp corresponding to the last status change of this condition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>reason</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Reason is a brief machine readable explanation for the condition&rsquo;s last transition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>message</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Message is a human readable description of the details of the last transition, complementing reason.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.CertificateRequestConditionType"> CertificateRequestConditionType (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.CertificateRequestCondition">CertificateRequestCondition</a>) </p>
<div>
  <p>CertificateRequestConditionType represents an Certificate condition value.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;InvalidRequest&#34;</p>
      </td>
      <td>
        <p> CertificateRequestConditionInvalidRequest indicates that a certificate signer has refused to sign the request due to at least one of the input parameters being invalid. Additional information about why the request was rejected can be found in the <code>reason</code> and <code>message</code> fields. </p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;Ready&#34;</p>
      </td>
      <td>
        <p>CertificateRequestConditionReady indicates that a certificate is ready for use. This is defined as: - The target certificate exists in CertificateRequest.Status</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.CertificateRequestSpec">CertificateRequestSpec</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.CertificateRequest">CertificateRequest</a>) </p>
<div>
  <p>CertificateRequestSpec defines the desired state of CertificateRequest</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>duration</code>
        <br />
        <em>
          <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Requested certificate default Duration</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>issuerRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
        </em>
      </td>
      <td>
        <p>IssuerRef is a reference to the issuer for this CertificateRequest. If the &lsquo;kind&rsquo; field is not set, or set to &lsquo;Issuer&rsquo;, an Issuer resource with the given name in the same namespace as the CertificateRequest will be used. If the &lsquo;kind&rsquo; field is set to &lsquo;ClusterIssuer&rsquo;, a ClusterIssuer with the provided name will be used. The &lsquo;name&rsquo; field in this stanza is required at all times. The group field refers to the API group of the issuer which defaults to &lsquo;cert-manager.io&rsquo; if empty.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>csr</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <p>Byte slice containing the PEM encoded CertificateSigningRequest</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>isCA</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>IsCA will mark the resulting certificate as valid for signing. This implies that the &lsquo;cert sign&rsquo; usage is set</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>usages</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.KeyUsage">[]KeyUsage</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Usages is the set of x509 actions that are enabled for a given key. Defaults are (&lsquo;digital signature&rsquo;, &lsquo;key encipherment&rsquo;) if empty</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.CertificateRequestStatus">CertificateRequestStatus</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.CertificateRequest">CertificateRequest</a>) </p>
<div>
  <p>CertificateStatus defines the observed state of CertificateRequest and resulting signed certificate.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>conditions</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.CertificateRequestCondition">[]CertificateRequestCondition</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>certificate</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Byte slice containing a PEM encoded signed certificate resulting from the given certificate signing request.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>ca</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Byte slice containing the PEM encoded certificate authority of the signed certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>failureTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>FailureTime stores the time that this CertificateRequest failed. This is used to influence garbage collection and back-off.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.CertificateSpec">CertificateSpec</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.Certificate">Certificate</a>) </p>
<div>
  <p>CertificateSpec defines the desired state of Certificate. A valid Certificate requires at least one of a CommonName, DNSName, or URISAN to be valid.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>subject</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.X509Subject">X509Subject</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Full X509 name specification (<a href="https://golang.org/pkg/crypto/x509/pkix/#Name">https://golang.org/pkg/crypto/x509/pkix/#Name</a>). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>commonName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>CommonName is a common name to be used on the Certificate. The CommonName should have a length of 64 characters or fewer to avoid generating invalid CSRs.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>organization</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Organization is the organization to be used on the Certificate</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>duration</code>
        <br />
        <em>
          <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Certificate default Duration</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>renewBefore</code>
        <br />
        <em>
          <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Certificate renew before expiration duration</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>dnsNames</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>DNSNames is a list of subject alt names to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>ipAddresses</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>IPAddresses is a list of IP addresses to be used on the Certificate</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>uriSANs</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>URISANs is a list of URI Subject Alternative Names to be set on this Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>secretName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>SecretName is the name of the secret resource to store this secret in</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>issuerRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
        </em>
      </td>
      <td>
        <p>IssuerRef is a reference to the issuer for this certificate. If the &lsquo;kind&rsquo; field is not set, or set to &lsquo;Issuer&rsquo;, an Issuer resource with the given name in the same namespace as the Certificate will be used. If the &lsquo;kind&rsquo; field is set to &lsquo;ClusterIssuer&rsquo;, a ClusterIssuer with the provided name will be used. The &lsquo;name&rsquo; field in this stanza is required at all times.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>isCA</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>IsCA will mark this Certificate as valid for signing. This implies that the &lsquo;cert sign&rsquo; usage is set</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>usages</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.KeyUsage">[]KeyUsage</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Usages is the set of x509 actions that are enabled for a given key. Defaults are (&lsquo;digital signature&rsquo;, &lsquo;key encipherment&rsquo;) if empty</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>keySize</code>
        <br />
        <em>int</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>KeySize is the key bit size of the corresponding private key for this certificate. If provided, value must be between 2048 and 8192 inclusive when KeyAlgorithm is empty or is set to &ldquo;rsa&rdquo;, and value must be one of (256, 384, 521) when KeyAlgorithm is set to &ldquo;ecdsa&rdquo;.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>keyAlgorithm</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.KeyAlgorithm">KeyAlgorithm</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>KeyAlgorithm is the private key algorithm of the corresponding private key for this certificate. If provided, allowed values are either &ldquo;rsa&rdquo; or &ldquo;ecdsa&rdquo; If KeyAlgorithm is specified and KeySize is not provided, key size of 256 will be used for &ldquo;ecdsa&rdquo; key algorithm and key size of 2048 will be used for &ldquo;rsa&rdquo; key algorithm.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>keyEncoding</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.KeyEncoding">KeyEncoding</a>
        </em>
      </td>
      <td>
        <p>KeyEncoding is the private key cryptography standards (PKCS) for this certificate&rsquo;s private key to be encoded in. If provided, allowed values are &ldquo;pkcs1&rdquo; and &ldquo;pkcs8&rdquo; standing for PKCS#1 and PKCS#8, respectively. If KeyEncoding is not specified, then PKCS#1 will be used by default.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.CertificateStatus">CertificateStatus</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.Certificate">Certificate</a>) </p>
<div>
  <p>CertificateStatus defines the observed state of Certificate</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>conditions</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.CertificateCondition">[]CertificateCondition</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>lastFailureTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>notAfter</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The expiration time of the certificate stored in the secret named by this resource in spec.secretName.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.GenericIssuer">GenericIssuer</h3>
<div></div>
<h3 id="cert-manager.io/v1alpha2.IssuerCondition">IssuerCondition</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.IssuerStatus">IssuerStatus</a>) </p>
<div>
  <p>IssuerCondition contains condition information for an Issuer.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>type</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.IssuerConditionType">IssuerConditionType</a>
        </em>
      </td>
      <td>
        <p>Type of the condition, currently (&lsquo;Ready&rsquo;).</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ConditionStatus">ConditionStatus</a>
        </em>
      </td>
      <td>
        <p>Status of the condition, one of (&lsquo;True&rsquo;, &lsquo;False&rsquo;, &lsquo;Unknown&rsquo;).</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>lastTransitionTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>LastTransitionTime is the timestamp corresponding to the last status change of this condition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>reason</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Reason is a brief machine readable explanation for the condition&rsquo;s last transition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>message</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Message is a human readable description of the details of the last transition, complementing reason.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.IssuerConditionType"> IssuerConditionType (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.IssuerCondition">IssuerCondition</a>) </p>
<div>
  <p>IssuerConditionType represents an Issuer condition value.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;Ready&#34;</p>
      </td>
      <td>
        <p>IssuerConditionReady represents the fact that a given Issuer condition is in ready state.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.IssuerConfig">IssuerConfig</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.IssuerSpec">IssuerSpec</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>acme</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuer">ACMEIssuer</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>ca</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.CAIssuer">CAIssuer</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>vault</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.VaultIssuer">VaultIssuer</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>selfSigned</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.SelfSignedIssuer">SelfSignedIssuer</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>venafi</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.VenafiIssuer">VenafiIssuer</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.IssuerSpec">IssuerSpec</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.ClusterIssuer">ClusterIssuer</a>, <a href="#cert-manager.io/v1alpha2.Issuer">Issuer</a>) </p>
<div>
  <p>IssuerSpec is the specification of an Issuer. This includes any configuration required for the issuer.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>IssuerConfig</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.IssuerConfig">IssuerConfig</a>
        </em>
      </td>
      <td>
        <p> (Members of <code>IssuerConfig</code> are embedded into this type.) </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.IssuerStatus">IssuerStatus</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.ClusterIssuer">ClusterIssuer</a>, <a href="#cert-manager.io/v1alpha2.Issuer">Issuer</a>) </p>
<div>
  <p>IssuerStatus contains status information about an Issuer</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>conditions</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.IssuerCondition">[]IssuerCondition</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>acme</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerStatus">ACMEIssuerStatus</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.KeyAlgorithm"> KeyAlgorithm (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.CertificateSpec">CertificateSpec</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;ecdsa&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;rsa&#34;</p>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.KeyEncoding"> KeyEncoding (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.CertificateSpec">CertificateSpec</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;pkcs1&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;pkcs8&#34;</p>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.KeyUsage"> KeyUsage (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.CertificateRequestSpec">CertificateRequestSpec</a>, <a href="#cert-manager.io/v1alpha2.CertificateSpec">CertificateSpec</a>) </p>
<div>
  <p>
    KeyUsage specifies valid usage contexts for keys. See: <a href="https://tools.ietf.org/html/rfc5280#section-4.2.1.3">https://tools.ietf.org/html/rfc5280#section-4.2.1.3</a>
    <a href="https://tools.ietf.org/html/rfc5280#section-4.2.1.12">https://tools.ietf.org/html/rfc5280#section-4.2.1.12</a>
    Valid KeyUsage values are as follows: &ldquo;signing&rdquo;, &ldquo;digital signature&rdquo;, &ldquo;content commitment&rdquo;, &ldquo;key encipherment&rdquo;, &ldquo;key agreement&rdquo;, &ldquo;data encipherment&rdquo;, &ldquo;cert sign&rdquo;, &ldquo;crl sign&rdquo;, &ldquo;encipher only&rdquo;, &ldquo;decipher only&rdquo;, &ldquo;any&rdquo;, &ldquo;server auth&rdquo;, &ldquo;client auth&rdquo;, &ldquo;code signing&rdquo;, &ldquo;email protection&rdquo;, &ldquo;s/mime&rdquo;, &ldquo;ipsec end system&rdquo;, &ldquo;ipsec tunnel&rdquo;, &ldquo;ipsec user&rdquo;, &ldquo;timestamping&rdquo;, &ldquo;ocsp signing&rdquo;, &ldquo;microsoft sgc&rdquo;, &ldquo;netscape sgc&rdquo;
  </p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;any&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;crl sign&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;cert sign&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;client auth&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;code signing&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;content commitment&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;data encipherment&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;decipher only&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;digital signature&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;email protection&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;encipher only&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;ipsec end system&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;ipsec tunnel&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;ipsec user&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;key agreement&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;key encipherment&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;microsoft sgc&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;netscape sgc&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;ocsp signing&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;s/mime&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;server auth&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;signing&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;timestamping&#34;</p>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.SelfSignedIssuer">SelfSignedIssuer</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.IssuerConfig">IssuerConfig</a>) </p>
<div></div>
<h3 id="cert-manager.io/v1alpha2.VaultAppRole">VaultAppRole</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.VaultAuth">VaultAuth</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>path</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Where the authentication path is mounted in Vault.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>roleId</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>secretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.VaultAuth">VaultAuth</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.VaultIssuer">VaultIssuer</a>) </p>
<div>
  <p>Vault authentication can be configured: - With a secret containing a token. Cert-manager is using this token as-is. - With a secret containing a AppRole. This AppRole is used to authenticate to Vault and retrieve a token.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>tokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>This Secret contains the Vault token key</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>appRole</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.VaultAppRole">VaultAppRole</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>This Secret contains a AppRole and Secret</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>kubernetes</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.VaultKubernetesAuth">VaultKubernetesAuth</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>This contains a Role and Secret with a ServiceAccount token to authenticate with vault.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.VaultIssuer">VaultIssuer</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.IssuerConfig">IssuerConfig</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>auth</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.VaultAuth">VaultAuth</a>
        </em>
      </td>
      <td>
        <p>Vault authentication</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>server</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Server is the vault connection address</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>path</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Vault URL path to the certificate role</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>caBundle</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Base64 encoded CA bundle to validate Vault server certificate. Only used if the Server URL is using HTTPS protocol. This parameter is ignored for plain HTTP protocol connection. If not set the system root certificates are used to validate the TLS connection.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.VaultKubernetesAuth">VaultKubernetesAuth</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.VaultAuth">VaultAuth</a>) </p>
<div>
  <p>Authenticate against Vault using a Kubernetes ServiceAccount token stored in a Secret.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>mountPath</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The Vault mountPath here is the mount path to use when authenticating with Vault. For example, setting a value to <code>/v1/auth/foo</code>, will use the path <code>/v1/auth/foo/login</code> to authenticate with Vault. If unspecified, the default value &ldquo;/v1/auth/kubernetes&rdquo; will be used. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>secretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p>The required Secret field containing a Kubernetes ServiceAccount JWT used for authenticating with Vault. Use of &lsquo;ambient credentials&rsquo; is not supported.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>role</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>A required field containing the Vault Role to assume. A Role binds a Kubernetes ServiceAccount with a set of Vault policies.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.VenafiCloud">VenafiCloud</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.VenafiIssuer">VenafiIssuer</a>) </p>
<div>
  <p>VenafiCloud defines connection configuration details for Venafi Cloud</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>URL is the base URL for Venafi Cloud</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>apiTokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p>APITokenSecretRef is a secret key selector for the Venafi Cloud API token.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.VenafiIssuer">VenafiIssuer</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.IssuerConfig">IssuerConfig</a>) </p>
<div>
  <p>VenafiIssuer describes issuer configuration details for Venafi Cloud.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>zone</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Zone is the Venafi Policy Zone to use for this issuer. All requests made to the Venafi platform will be restricted by the named zone policy. This field is required.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>tpp</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.VenafiTPP">VenafiTPP</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>TPP specifies Trust Protection Platform configuration settings. Only one of TPP or Cloud may be specified.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>cloud</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.VenafiCloud">VenafiCloud</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Cloud specifies the Venafi cloud configuration settings. Only one of TPP or Cloud may be specified.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.VenafiTPP">VenafiTPP</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.VenafiIssuer">VenafiIssuer</a>) </p>
<div>
  <p>VenafiTPP defines connection configuration details for a Venafi TPP instance</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>URL is the base URL for the Venafi TPP instance</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>credentialsRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.LocalObjectReference">LocalObjectReference</a>
        </em>
      </td>
      <td>
        <p>CredentialsRef is a reference to a Secret containing the username and password for the TPP server. The secret must contain two keys, &lsquo;username&rsquo; and &lsquo;password&rsquo;.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>caBundle</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>CABundle is a PEM encoded TLS certifiate to use to verify connections to the TPP instance. If specified, system roots will not be used and the issuing CA for the TPP instance must be verifiable using the provided root. If not specified, the connection will be verified using the cert-manager system root certificates.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.X509Subject">X509Subject</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.CertificateSpec">CertificateSpec</a>) </p>
<div>
  <p>X509Subject Full X509 name specification</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>countries</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Countries to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>organizationalUnits</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Organizational Units to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>localities</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Cities to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>provinces</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>State/Provinces to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>streetAddresses</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Street addresses to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>postalCodes</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Postal codes to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>serialNumber</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Serial number to be used on the Certificate.</p>
      </td>
    </tr>
  </tbody>
</table>
<hr />
<h2 id="cert-manager.io/v1alpha3">cert-manager.io/v1alpha3</h2>
<div>
  <p>Package v1alpha3 is the v1alpha3 version of the API.</p>
</div>
Resource Types:
<ul>
  <li>
    <a href="#cert-manager.io/v1alpha3.Certificate">Certificate</a>
  </li>
  <li>
    <a href="#cert-manager.io/v1alpha3.CertificateRequest">CertificateRequest</a>
  </li>
  <li>
    <a href="#cert-manager.io/v1alpha3.ClusterIssuer">ClusterIssuer</a>
  </li>
  <li>
    <a href="#cert-manager.io/v1alpha3.Issuer">Issuer</a>
  </li>
</ul>
<h3 id="cert-manager.io/v1alpha3.Certificate">Certificate</h3>
<div>
  <p>Certificate is a type to represent a Certificate from ACME</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>cert-manager.io/v1alpha3</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>Certificate</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.CertificateSpec">CertificateSpec</a>
        </em>
      </td>
      <td>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>subject</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1alpha3.X509Subject">X509Subject</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> Full X509 name specification (<a href="https://golang.org/pkg/crypto/x509/pkix/#Name">https://golang.org/pkg/crypto/x509/pkix/#Name</a>). </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>commonName</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>CommonName is a common name to be used on the Certificate. The CommonName should have a length of 64 characters or fewer to avoid generating invalid CSRs.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>organization</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>Organization is the organization to be used on the Certificate</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>duration</code>
              <br />
              <em>
                <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>Certificate default Duration</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>renewBefore</code>
              <br />
              <em>
                <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>Certificate renew before expiration duration</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>dnsNames</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>DNSNames is a list of subject alt names to be used on the Certificate.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>ipAddresses</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>IPAddresses is a list of IP addresses to be used on the Certificate</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>uriSANs</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>URISANs is a list of URI Subject Alternative Names to be set on this Certificate.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>secretName</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p>SecretName is the name of the secret resource to store this secret in</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>issuerRef</code>
              <br />
              <em>
                <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
              </em>
            </td>
            <td>
              <p>IssuerRef is a reference to the issuer for this certificate. If the &lsquo;kind&rsquo; field is not set, or set to &lsquo;Issuer&rsquo;, an Issuer resource with the given name in the same namespace as the Certificate will be used. If the &lsquo;kind&rsquo; field is set to &lsquo;ClusterIssuer&rsquo;, a ClusterIssuer with the provided name will be used. The &lsquo;name&rsquo; field in this stanza is required at all times.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>isCA</code>
              <br />
              <em>bool</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>IsCA will mark this Certificate as valid for signing. This implies that the &lsquo;cert sign&rsquo; usage is set</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>usages</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1alpha3.KeyUsage">[]KeyUsage</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>Usages is the set of x509 actions that are enabled for a given key. Defaults are (&lsquo;digital signature&rsquo;, &lsquo;key encipherment&rsquo;) if empty</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>keySize</code>
              <br />
              <em>int</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>KeySize is the key bit size of the corresponding private key for this certificate. If provided, value must be between 2048 and 8192 inclusive when KeyAlgorithm is empty or is set to &ldquo;rsa&rdquo;, and value must be one of (256, 384, 521) when KeyAlgorithm is set to &ldquo;ecdsa&rdquo;.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>keyAlgorithm</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1alpha3.KeyAlgorithm">KeyAlgorithm</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>KeyAlgorithm is the private key algorithm of the corresponding private key for this certificate. If provided, allowed values are either &ldquo;rsa&rdquo; or &ldquo;ecdsa&rdquo; If KeyAlgorithm is specified and KeySize is not provided, key size of 256 will be used for &ldquo;ecdsa&rdquo; key algorithm and key size of 2048 will be used for &ldquo;rsa&rdquo; key algorithm.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>keyEncoding</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1alpha3.KeyEncoding">KeyEncoding</a>
              </em>
            </td>
            <td>
              <p>KeyEncoding is the private key cryptography standards (PKCS) for this certificate&rsquo;s private key to be encoded in. If provided, allowed values are &ldquo;pkcs1&rdquo; and &ldquo;pkcs8&rdquo; standing for PKCS#1 and PKCS#8, respectively. If KeyEncoding is not specified, then PKCS#1 will be used by default.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.CertificateStatus">CertificateStatus</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.CertificateRequest">CertificateRequest</h3>
<div>
  <p>CertificateRequest is a type to represent a Certificate Signing Request</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>cert-manager.io/v1alpha3</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>CertificateRequest</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.CertificateRequestSpec">CertificateRequestSpec</a>
        </em>
      </td>
      <td>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>duration</code>
              <br />
              <em>
                <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>Requested certificate default Duration</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>issuerRef</code>
              <br />
              <em>
                <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
              </em>
            </td>
            <td>
              <p>IssuerRef is a reference to the issuer for this CertificateRequest. If the &lsquo;kind&rsquo; field is not set, or set to &lsquo;Issuer&rsquo;, an Issuer resource with the given name in the same namespace as the CertificateRequest will be used. If the &lsquo;kind&rsquo; field is set to &lsquo;ClusterIssuer&rsquo;, a ClusterIssuer with the provided name will be used. The &lsquo;name&rsquo; field in this stanza is required at all times. The group field refers to the API group of the issuer which defaults to &lsquo;cert-manager.io&rsquo; if empty.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>csr</code>
              <br />
              <em>[]byte</em>
            </td>
            <td>
              <p>Byte slice containing the PEM encoded CertificateSigningRequest</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>isCA</code>
              <br />
              <em>bool</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>IsCA will mark the resulting certificate as valid for signing. This implies that the &lsquo;cert sign&rsquo; usage is set</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>usages</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1alpha3.KeyUsage">[]KeyUsage</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>Usages is the set of x509 actions that are enabled for a given key. Defaults are (&lsquo;digital signature&rsquo;, &lsquo;key encipherment&rsquo;) if empty</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.CertificateRequestStatus">CertificateRequestStatus</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.ClusterIssuer">ClusterIssuer</h3>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>cert-manager.io/v1alpha3</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>ClusterIssuer</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.IssuerSpec">IssuerSpec</a>
        </em>
      </td>
      <td>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>IssuerConfig</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1alpha3.IssuerConfig">IssuerConfig</a>
              </em>
            </td>
            <td>
              <p> (Members of <code>IssuerConfig</code> are embedded into this type.) </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.IssuerStatus">IssuerStatus</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.Issuer">Issuer</h3>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>cert-manager.io/v1alpha3</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>Issuer</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.IssuerSpec">IssuerSpec</a>
        </em>
      </td>
      <td>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>IssuerConfig</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1alpha3.IssuerConfig">IssuerConfig</a>
              </em>
            </td>
            <td>
              <p> (Members of <code>IssuerConfig</code> are embedded into this type.) </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.IssuerStatus">IssuerStatus</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.CAIssuer">CAIssuer</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.IssuerConfig">IssuerConfig</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>secretName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>SecretName is the name of the secret used to sign Certificates issued by this Issuer.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.CertificateCondition">CertificateCondition</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.CertificateStatus">CertificateStatus</a>) </p>
<div>
  <p>CertificateCondition contains condition information for an Certificate.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>type</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.CertificateConditionType">CertificateConditionType</a>
        </em>
      </td>
      <td>
        <p>Type of the condition, currently (&lsquo;Ready&rsquo;).</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ConditionStatus">ConditionStatus</a>
        </em>
      </td>
      <td>
        <p>Status of the condition, one of (&lsquo;True&rsquo;, &lsquo;False&rsquo;, &lsquo;Unknown&rsquo;).</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>lastTransitionTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>LastTransitionTime is the timestamp corresponding to the last status change of this condition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>reason</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Reason is a brief machine readable explanation for the condition&rsquo;s last transition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>message</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Message is a human readable description of the details of the last transition, complementing reason.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.CertificateConditionType"> CertificateConditionType (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.CertificateCondition">CertificateCondition</a>) </p>
<div>
  <p>CertificateConditionType represents an Certificate condition value.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;Ready&#34;</p>
      </td>
      <td>
        <p>CertificateConditionReady indicates that a certificate is ready for use. This is defined as: - The target secret exists - The target secret contains a certificate that has not expired - The target secret contains a private key valid for the certificate - The commonName and dnsNames attributes match those specified on the Certificate</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.CertificateRequestCondition">CertificateRequestCondition</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.CertificateRequestStatus">CertificateRequestStatus</a>) </p>
<div>
  <p>CertificateRequestCondition contains condition information for a CertificateRequest.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>type</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.CertificateRequestConditionType">CertificateRequestConditionType</a>
        </em>
      </td>
      <td>
        <p>Type of the condition, currently (&lsquo;Ready&rsquo;).</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ConditionStatus">ConditionStatus</a>
        </em>
      </td>
      <td>
        <p>Status of the condition, one of (&lsquo;True&rsquo;, &lsquo;False&rsquo;, &lsquo;Unknown&rsquo;).</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>lastTransitionTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>LastTransitionTime is the timestamp corresponding to the last status change of this condition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>reason</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Reason is a brief machine readable explanation for the condition&rsquo;s last transition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>message</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Message is a human readable description of the details of the last transition, complementing reason.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.CertificateRequestConditionType"> CertificateRequestConditionType (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.CertificateRequestCondition">CertificateRequestCondition</a>) </p>
<div>
  <p>CertificateRequestConditionType represents an Certificate condition value.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;Ready&#34;</p>
      </td>
      <td>
        <p>CertificateRequestConditionReady indicates that a certificate is ready for use. This is defined as: - The target certificate exists in CertificateRequest.Status</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.CertificateRequestSpec">CertificateRequestSpec</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.CertificateRequest">CertificateRequest</a>) </p>
<div>
  <p>CertificateRequestSpec defines the desired state of CertificateRequest</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>duration</code>
        <br />
        <em>
          <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Requested certificate default Duration</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>issuerRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
        </em>
      </td>
      <td>
        <p>IssuerRef is a reference to the issuer for this CertificateRequest. If the &lsquo;kind&rsquo; field is not set, or set to &lsquo;Issuer&rsquo;, an Issuer resource with the given name in the same namespace as the CertificateRequest will be used. If the &lsquo;kind&rsquo; field is set to &lsquo;ClusterIssuer&rsquo;, a ClusterIssuer with the provided name will be used. The &lsquo;name&rsquo; field in this stanza is required at all times. The group field refers to the API group of the issuer which defaults to &lsquo;cert-manager.io&rsquo; if empty.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>csr</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <p>Byte slice containing the PEM encoded CertificateSigningRequest</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>isCA</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>IsCA will mark the resulting certificate as valid for signing. This implies that the &lsquo;cert sign&rsquo; usage is set</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>usages</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.KeyUsage">[]KeyUsage</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Usages is the set of x509 actions that are enabled for a given key. Defaults are (&lsquo;digital signature&rsquo;, &lsquo;key encipherment&rsquo;) if empty</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.CertificateRequestStatus">CertificateRequestStatus</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.CertificateRequest">CertificateRequest</a>) </p>
<div>
  <p>CertificateStatus defines the observed state of CertificateRequest and resulting signed certificate.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>conditions</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.CertificateRequestCondition">[]CertificateRequestCondition</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>certificate</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Byte slice containing a PEM encoded signed certificate resulting from the given certificate signing request.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>ca</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Byte slice containing the PEM encoded certificate authority of the signed certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>failureTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>FailureTime stores the time that this CertificateRequest failed. This is used to influence garbage collection and back-off.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.CertificateSpec">CertificateSpec</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.Certificate">Certificate</a>) </p>
<div>
  <p>CertificateSpec defines the desired state of Certificate. A valid Certificate requires at least one of a CommonName, DNSName, or URISAN to be valid.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>subject</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.X509Subject">X509Subject</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Full X509 name specification (<a href="https://golang.org/pkg/crypto/x509/pkix/#Name">https://golang.org/pkg/crypto/x509/pkix/#Name</a>). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>commonName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>CommonName is a common name to be used on the Certificate. The CommonName should have a length of 64 characters or fewer to avoid generating invalid CSRs.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>organization</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Organization is the organization to be used on the Certificate</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>duration</code>
        <br />
        <em>
          <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Certificate default Duration</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>renewBefore</code>
        <br />
        <em>
          <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Certificate renew before expiration duration</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>dnsNames</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>DNSNames is a list of subject alt names to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>ipAddresses</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>IPAddresses is a list of IP addresses to be used on the Certificate</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>uriSANs</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>URISANs is a list of URI Subject Alternative Names to be set on this Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>secretName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>SecretName is the name of the secret resource to store this secret in</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>issuerRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
        </em>
      </td>
      <td>
        <p>IssuerRef is a reference to the issuer for this certificate. If the &lsquo;kind&rsquo; field is not set, or set to &lsquo;Issuer&rsquo;, an Issuer resource with the given name in the same namespace as the Certificate will be used. If the &lsquo;kind&rsquo; field is set to &lsquo;ClusterIssuer&rsquo;, a ClusterIssuer with the provided name will be used. The &lsquo;name&rsquo; field in this stanza is required at all times.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>isCA</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>IsCA will mark this Certificate as valid for signing. This implies that the &lsquo;cert sign&rsquo; usage is set</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>usages</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.KeyUsage">[]KeyUsage</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Usages is the set of x509 actions that are enabled for a given key. Defaults are (&lsquo;digital signature&rsquo;, &lsquo;key encipherment&rsquo;) if empty</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>keySize</code>
        <br />
        <em>int</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>KeySize is the key bit size of the corresponding private key for this certificate. If provided, value must be between 2048 and 8192 inclusive when KeyAlgorithm is empty or is set to &ldquo;rsa&rdquo;, and value must be one of (256, 384, 521) when KeyAlgorithm is set to &ldquo;ecdsa&rdquo;.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>keyAlgorithm</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.KeyAlgorithm">KeyAlgorithm</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>KeyAlgorithm is the private key algorithm of the corresponding private key for this certificate. If provided, allowed values are either &ldquo;rsa&rdquo; or &ldquo;ecdsa&rdquo; If KeyAlgorithm is specified and KeySize is not provided, key size of 256 will be used for &ldquo;ecdsa&rdquo; key algorithm and key size of 2048 will be used for &ldquo;rsa&rdquo; key algorithm.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>keyEncoding</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.KeyEncoding">KeyEncoding</a>
        </em>
      </td>
      <td>
        <p>KeyEncoding is the private key cryptography standards (PKCS) for this certificate&rsquo;s private key to be encoded in. If provided, allowed values are &ldquo;pkcs1&rdquo; and &ldquo;pkcs8&rdquo; standing for PKCS#1 and PKCS#8, respectively. If KeyEncoding is not specified, then PKCS#1 will be used by default.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.CertificateStatus">CertificateStatus</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.Certificate">Certificate</a>) </p>
<div>
  <p>CertificateStatus defines the observed state of Certificate</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>conditions</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.CertificateCondition">[]CertificateCondition</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>lastFailureTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>notAfter</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The expiration time of the certificate stored in the secret named by this resource in spec.secretName.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.GenericIssuer">GenericIssuer</h3>
<div></div>
<h3 id="cert-manager.io/v1alpha3.IssuerCondition">IssuerCondition</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.IssuerStatus">IssuerStatus</a>) </p>
<div>
  <p>IssuerCondition contains condition information for an Issuer.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>type</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.IssuerConditionType">IssuerConditionType</a>
        </em>
      </td>
      <td>
        <p>Type of the condition, currently (&lsquo;Ready&rsquo;).</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ConditionStatus">ConditionStatus</a>
        </em>
      </td>
      <td>
        <p>Status of the condition, one of (&lsquo;True&rsquo;, &lsquo;False&rsquo;, &lsquo;Unknown&rsquo;).</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>lastTransitionTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>LastTransitionTime is the timestamp corresponding to the last status change of this condition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>reason</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Reason is a brief machine readable explanation for the condition&rsquo;s last transition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>message</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Message is a human readable description of the details of the last transition, complementing reason.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.IssuerConditionType"> IssuerConditionType (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.IssuerCondition">IssuerCondition</a>) </p>
<div>
  <p>IssuerConditionType represents an Issuer condition value.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;Ready&#34;</p>
      </td>
      <td>
        <p>IssuerConditionReady represents the fact that a given Issuer condition is in ready state.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.IssuerConfig">IssuerConfig</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.IssuerSpec">IssuerSpec</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>acme</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuer">ACMEIssuer</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>ca</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.CAIssuer">CAIssuer</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>vault</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.VaultIssuer">VaultIssuer</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>selfSigned</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.SelfSignedIssuer">SelfSignedIssuer</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>venafi</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.VenafiIssuer">VenafiIssuer</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.IssuerSpec">IssuerSpec</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.ClusterIssuer">ClusterIssuer</a>, <a href="#cert-manager.io/v1alpha3.Issuer">Issuer</a>) </p>
<div>
  <p>IssuerSpec is the specification of an Issuer. This includes any configuration required for the issuer.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>IssuerConfig</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.IssuerConfig">IssuerConfig</a>
        </em>
      </td>
      <td>
        <p> (Members of <code>IssuerConfig</code> are embedded into this type.) </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.IssuerStatus">IssuerStatus</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.ClusterIssuer">ClusterIssuer</a>, <a href="#cert-manager.io/v1alpha3.Issuer">Issuer</a>) </p>
<div>
  <p>IssuerStatus contains status information about an Issuer</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>conditions</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.IssuerCondition">[]IssuerCondition</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>acme</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerStatus">ACMEIssuerStatus</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.KeyAlgorithm"> KeyAlgorithm (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.CertificateSpec">CertificateSpec</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;ecdsa&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;rsa&#34;</p>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.KeyEncoding"> KeyEncoding (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.CertificateSpec">CertificateSpec</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;pkcs1&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;pkcs8&#34;</p>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.KeyUsage"> KeyUsage (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.CertificateRequestSpec">CertificateRequestSpec</a>, <a href="#cert-manager.io/v1alpha3.CertificateSpec">CertificateSpec</a>) </p>
<div>
  <p>
    KeyUsage specifies valid usage contexts for keys. See: <a href="https://tools.ietf.org/html/rfc5280#section-4.2.1.3">https://tools.ietf.org/html/rfc5280#section-4.2.1.3</a>
    <a href="https://tools.ietf.org/html/rfc5280#section-4.2.1.12">https://tools.ietf.org/html/rfc5280#section-4.2.1.12</a>
    Valid KeyUsage values are as follows: &ldquo;signing&rdquo;, &ldquo;digital signature&rdquo;, &ldquo;content commitment&rdquo;, &ldquo;key encipherment&rdquo;, &ldquo;key agreement&rdquo;, &ldquo;data encipherment&rdquo;, &ldquo;cert sign&rdquo;, &ldquo;crl sign&rdquo;, &ldquo;encipher only&rdquo;, &ldquo;decipher only&rdquo;, &ldquo;any&rdquo;, &ldquo;server auth&rdquo;, &ldquo;client auth&rdquo;, &ldquo;code signing&rdquo;, &ldquo;email protection&rdquo;, &ldquo;s/mime&rdquo;, &ldquo;ipsec end system&rdquo;, &ldquo;ipsec tunnel&rdquo;, &ldquo;ipsec user&rdquo;, &ldquo;timestamping&rdquo;, &ldquo;ocsp signing&rdquo;, &ldquo;microsoft sgc&rdquo;, &ldquo;netscape sgc&rdquo;
  </p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;any&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;crl sign&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;cert sign&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;client auth&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;code signing&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;content commitment&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;data encipherment&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;decipher only&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;digital signature&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;email protection&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;encipher only&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;ipsec end system&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;ipsec tunnel&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;ipsec user&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;key agreement&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;key encipherment&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;microsoft sgc&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;netscape sgc&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;ocsp signing&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;s/mime&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;server auth&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;signing&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;timestamping&#34;</p>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.SelfSignedIssuer">SelfSignedIssuer</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.IssuerConfig">IssuerConfig</a>) </p>
<div></div>
<h3 id="cert-manager.io/v1alpha3.VaultAppRole">VaultAppRole</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.VaultAuth">VaultAuth</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>path</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Where the authentication path is mounted in Vault.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>roleId</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>secretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.VaultAuth">VaultAuth</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.VaultIssuer">VaultIssuer</a>) </p>
<div>
  <p>Vault authentication can be configured: - With a secret containing a token. Cert-manager is using this token as-is. - With a secret containing a AppRole. This AppRole is used to authenticate to Vault and retrieve a token.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>tokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>This Secret contains the Vault token key</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>appRole</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.VaultAppRole">VaultAppRole</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>This Secret contains a AppRole and Secret</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>kubernetes</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.VaultKubernetesAuth">VaultKubernetesAuth</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>This contains a Role and Secret with a ServiceAccount token to authenticate with vault.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.VaultIssuer">VaultIssuer</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.IssuerConfig">IssuerConfig</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>auth</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.VaultAuth">VaultAuth</a>
        </em>
      </td>
      <td>
        <p>Vault authentication</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>server</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Server is the vault connection address</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>path</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Vault URL path to the certificate role</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>caBundle</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Base64 encoded CA bundle to validate Vault server certificate. Only used if the Server URL is using HTTPS protocol. This parameter is ignored for plain HTTP protocol connection. If not set the system root certificates are used to validate the TLS connection.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.VaultKubernetesAuth">VaultKubernetesAuth</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.VaultAuth">VaultAuth</a>) </p>
<div>
  <p>Authenticate against Vault using a Kubernetes ServiceAccount token stored in a Secret.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>mountPath</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The Vault mountPath here is the mount path to use when authenticating with Vault. For example, setting a value to <code>/v1/auth/foo</code>, will use the path <code>/v1/auth/foo/login</code> to authenticate with Vault. If unspecified, the default value &ldquo;/v1/auth/kubernetes&rdquo; will be used. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>secretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p>The required Secret field containing a Kubernetes ServiceAccount JWT used for authenticating with Vault. Use of &lsquo;ambient credentials&rsquo; is not supported.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>role</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>A required field containing the Vault Role to assume. A Role binds a Kubernetes ServiceAccount with a set of Vault policies.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.VenafiCloud">VenafiCloud</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.VenafiIssuer">VenafiIssuer</a>) </p>
<div>
  <p>VenafiCloud defines connection configuration details for Venafi Cloud</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>URL is the base URL for Venafi Cloud</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>apiTokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p>APITokenSecretRef is a secret key selector for the Venafi Cloud API token.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.VenafiIssuer">VenafiIssuer</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.IssuerConfig">IssuerConfig</a>) </p>
<div>
  <p>VenafiIssuer describes issuer configuration details for Venafi Cloud.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>zone</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Zone is the Venafi Policy Zone to use for this issuer. All requests made to the Venafi platform will be restricted by the named zone policy. This field is required.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>tpp</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.VenafiTPP">VenafiTPP</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>TPP specifies Trust Protection Platform configuration settings. Only one of TPP or Cloud may be specified.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>cloud</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.VenafiCloud">VenafiCloud</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Cloud specifies the Venafi cloud configuration settings. Only one of TPP or Cloud may be specified.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.VenafiTPP">VenafiTPP</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.VenafiIssuer">VenafiIssuer</a>) </p>
<div>
  <p>VenafiTPP defines connection configuration details for a Venafi TPP instance</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>URL is the base URL for the Venafi TPP instance</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>credentialsRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.LocalObjectReference">LocalObjectReference</a>
        </em>
      </td>
      <td>
        <p>CredentialsRef is a reference to a Secret containing the username and password for the TPP server. The secret must contain two keys, &lsquo;username&rsquo; and &lsquo;password&rsquo;.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>caBundle</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>CABundle is a PEM encoded TLS certifiate to use to verify connections to the TPP instance. If specified, system roots will not be used and the issuing CA for the TPP instance must be verifiable using the provided root. If not specified, the connection will be verified using the cert-manager system root certificates.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.X509Subject">X509Subject</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.CertificateSpec">CertificateSpec</a>) </p>
<div>
  <p>X509Subject Full X509 name specification</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>countries</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Countries to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>organizationalUnits</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Organizational Units to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>localities</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Cities to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>provinces</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>State/Provinces to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>streetAddresses</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Street addresses to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>postalCodes</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Postal codes to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>serialNumber</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Serial number to be used on the Certificate.</p>
      </td>
    </tr>
  </tbody>
</table>
<hr />
<h2 id="meta.cert-manager.io/v1">meta.cert-manager.io/v1</h2>
<div>
  <p>Package meta contains meta types for cert-manager APIs</p>
</div>
Resource Types:
<ul></ul>
<h3 id="meta.cert-manager.io/v1.ConditionStatus"> ConditionStatus (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.CertificateCondition">CertificateCondition</a>, <a href="#cert-manager.io/v1alpha2.CertificateRequestCondition">CertificateRequestCondition</a>, <a href="#cert-manager.io/v1alpha2.IssuerCondition">IssuerCondition</a>, <a href="#cert-manager.io/v1alpha3.CertificateCondition">CertificateCondition</a>, <a href="#cert-manager.io/v1alpha3.CertificateRequestCondition">CertificateRequestCondition</a>, <a href="#cert-manager.io/v1alpha3.IssuerCondition">IssuerCondition</a>) </p>
<div>
  <p>ConditionStatus represents a condition&rsquo;s status.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;False&#34;</p>
      </td>
      <td>
        <p>ConditionFalse represents the fact that a given condition is false</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;True&#34;</p>
      </td>
      <td>
        <p>ConditionTrue represents the fact that a given condition is true</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;Unknown&#34;</p>
      </td>
      <td>
        <p>ConditionUnknown represents the fact that a given condition is unknown</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="meta.cert-manager.io/v1.LocalObjectReference">LocalObjectReference</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.VenafiTPP">VenafiTPP</a>, <a href="#cert-manager.io/v1alpha3.VenafiTPP">VenafiTPP</a>, <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>name</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>
          Name of the referent. More info: <a href="https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names">https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names</a>
          TODO: Add other useful fields. apiVersion, kind, uid?
        </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="meta.cert-manager.io/v1.ObjectReference">ObjectReference</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ChallengeSpec">ChallengeSpec</a>, <a href="#acme.cert-manager.io/v1alpha2.OrderSpec">OrderSpec</a>, <a href="#acme.cert-manager.io/v1alpha3.ChallengeSpec">ChallengeSpec</a>, <a href="#acme.cert-manager.io/v1alpha3.OrderSpec">OrderSpec</a>, <a href="#cert-manager.io/v1alpha2.CertificateRequestSpec">CertificateRequestSpec</a>, <a href="#cert-manager.io/v1alpha2.CertificateSpec">CertificateSpec</a>, <a href="#cert-manager.io/v1alpha3.CertificateRequestSpec">CertificateRequestSpec</a>, <a href="#cert-manager.io/v1alpha3.CertificateSpec">CertificateSpec</a>) </p>
<div>
  <p>ObjectReference is a reference to an object with a given name, kind and group.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>name</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>group</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</h3>
<p>
  (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEExternalAccountBinding">ACMEExternalAccountBinding</a>, <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuer">ACMEIssuer</a>, <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderAcmeDNS">ACMEIssuerDNS01ProviderAcmeDNS</a>, <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderAkamai">ACMEIssuerDNS01ProviderAkamai</a>, <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderAzureDNS">ACMEIssuerDNS01ProviderAzureDNS</a>, <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderCloudDNS">ACMEIssuerDNS01ProviderCloudDNS</a>, <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderCloudflare">ACMEIssuerDNS01ProviderCloudflare</a>, <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderDigitalOcean">ACMEIssuerDNS01ProviderDigitalOcean</a>, <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderRFC2136">ACMEIssuerDNS01ProviderRFC2136</a>,
  <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderRoute53">ACMEIssuerDNS01ProviderRoute53</a>, <a href="#acme.cert-manager.io/v1alpha3.ACMEExternalAccountBinding">ACMEExternalAccountBinding</a>, <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuer">ACMEIssuer</a>, <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderAcmeDNS">ACMEIssuerDNS01ProviderAcmeDNS</a>, <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderAkamai">ACMEIssuerDNS01ProviderAkamai</a>, <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderAzureDNS">ACMEIssuerDNS01ProviderAzureDNS</a>, <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderCloudDNS">ACMEIssuerDNS01ProviderCloudDNS</a>, <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderCloudflare">ACMEIssuerDNS01ProviderCloudflare</a>, <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderDigitalOcean">ACMEIssuerDNS01ProviderDigitalOcean</a>,
  <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderRFC2136">ACMEIssuerDNS01ProviderRFC2136</a>, <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderRoute53">ACMEIssuerDNS01ProviderRoute53</a>, <a href="#cert-manager.io/v1alpha2.VaultAppRole">VaultAppRole</a>, <a href="#cert-manager.io/v1alpha2.VaultAuth">VaultAuth</a>, <a href="#cert-manager.io/v1alpha2.VaultKubernetesAuth">VaultKubernetesAuth</a>, <a href="#cert-manager.io/v1alpha2.VenafiCloud">VenafiCloud</a>, <a href="#cert-manager.io/v1alpha3.VaultAppRole">VaultAppRole</a>, <a href="#cert-manager.io/v1alpha3.VaultAuth">VaultAuth</a>, <a href="#cert-manager.io/v1alpha3.VaultKubernetesAuth">VaultKubernetesAuth</a>, <a href="#cert-manager.io/v1alpha3.VenafiCloud">VenafiCloud</a>)
</p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>LocalObjectReference</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.LocalObjectReference">LocalObjectReference</a>
        </em>
      </td>
      <td>
        <p> (Members of <code>LocalObjectReference</code> are embedded into this type.) </p>
        <p>The name of the secret in the pod&rsquo;s namespace to select from.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>key</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The key of the secret to select from. Must be a valid secret key.</p>
      </td>
    </tr>
  </tbody>
</table>
<hr />
<p>
  <em> Generated with <code>gen-crd-api-reference-docs</code> on git commit <code>07104ac43</code>. </em>
</p>