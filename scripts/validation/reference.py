import json, numpy as np
from scipy import stats, optimize
d=json.load(open('data.json')); js=json.load(open('js.json'))
rows=[]
def chk(test, label, mine, ref, tol=1e-3):
    ok = abs(mine-ref) <= tol*max(1,abs(ref))
    rows.append(dict(test=test,label=label,solvegrid=mine,reference=ref,ok=bool(ok)))
g1,g2,g3=map(np.array,(d['g1'],d['g2'],d['g3']))
r=stats.ttest_ind(g1,g2,equal_var=False); chk('Welch t-test','t',js['t_welch']['t'],r.statistic); chk('Welch t-test','df',js['t_welch']['df'],r.df); chk('Welch t-test','p',js['t_welch']['p'],r.pvalue)
r=stats.ttest_ind(g1,g2); chk("Student's t-test",'t',js['t_student']['t'],r.statistic); chk("Student's t-test",'p',js['t_student']['p'],r.pvalue)
r=stats.ttest_rel(d['pre'],d['post']); chk('Paired t-test','|t|',abs(js['t_paired']['t']),abs(r.statistic)); chk('Paired t-test','p',js['t_paired']['p'],r.pvalue)
r=stats.ttest_1samp(g1,12); chk('One-sample t-test','t',js['t_one']['t'],r.statistic); chk('One-sample t-test','p',js['t_one']['p'],r.pvalue)
r=stats.f_oneway(g1,g2,g3); chk('One-way ANOVA','F',js['anova']['f'],r.statistic); chk('One-way ANOVA','p',js['anova']['p'],r.pvalue)
r=stats.chi2_contingency(d['table'],correction=False); chk('Chi-square independence','χ²',js['chi']['statistic'],r.statistic); chk('Chi-square independence','p',js['chi']['p'],r.pvalue)
r=stats.pearsonr(d['x'],d['y']); chk('Pearson correlation','r',js['pearson']['r'],r.statistic); chk('Pearson correlation','p',js['pearson']['p'],r.pvalue)
r=stats.spearmanr(d['x'],d['y']); chk('Spearman correlation','rho',js['spearman']['r'],r.statistic); chk('Spearman correlation','p',js['spearman']['p'],r.pvalue)
r=stats.kendalltau(d['x'],d['y']); chk("Kendall's tau",'tau-b',js['kendall']['r'],r.statistic)
r=stats.mannwhitneyu(g1,g2,alternative='two-sided',method='asymptotic',use_continuity=True); chk('Mann-Whitney U','U (smaller)',js['mw']['u'],min(r.statistic,len(g1)*len(g2)-r.statistic)); chk('Mann-Whitney U','p',js['mw']['p'],r.pvalue,5e-3)
r=stats.wilcoxon(d['pre'],d['post']); chk('Wilcoxon signed-rank','T',js['wil']['t'],r.statistic); 
r=stats.kruskal(g1,g2,g3); chk('Kruskal-Wallis','H',js['kw']['h'],r.statistic); chk('Kruskal-Wallis','p',js['kw']['p'],r.pvalue)
rm=np.array(d['rm']); r=stats.friedmanchisquare(*rm.T); chk('Friedman test','χ²',js['fried']['chiSquare'],r.statistic); chk('Friedman test','p',js['fried']['p'],r.pvalue)
r=stats.shapiro(d['y']); chk('Shapiro-Wilk','W',js['shapiro']['w'],r.statistic); chk('Shapiro-Wilk','p',js['shapiro']['p'],r.pvalue,2e-2)
X=np.array(d['items']); k=X.shape[1]; a=k/(k-1)*(1-X.var(0,ddof=1).sum()/X.sum(1).var(ddof=1)); chk("Cronbach's alpha",'α',js['cronbach']['alpha'],a)
y=np.array(d['y'],float); Xr=np.column_stack([np.ones(len(y)),d['x'],d['x2']]); b,res,*_=np.linalg.lstsq(Xr,y,rcond=None)
chk('Linear regression','b1',js['reg']['coefficients'][1]['b'],b[1]); chk('Linear regression','b2',js['reg']['coefficients'][2]['b'],b[2])
sse=((y-Xr@b)**2).sum(); sst=((y-y.mean())**2).sum(); chk('Linear regression','R²',js['reg']['rSquared'],1-sse/sst)
r=stats.binomtest(4,19,0.5); chk('McNemar (exact)','p',js['mcn']['pExact'],r.pvalue)
chk('p value calculator','z = 1.96, two-tailed',js['pz']['p'],2*stats.norm.sf(1.96))
chk('p value calculator','t = 2.5, df 20, two-tailed',js['pt']['p'],2*stats.t.sf(2.5,20))
chk('p value calculator','t = 2.5, df 20, right-tailed',js['ptr']['p'],stats.t.sf(2.5,20))
chk('p value calculator','t = −1.3, df 15, left-tailed',js['ptl']['p'],stats.t.cdf(-1.3,15))
chk('p value calculator','F = 4.2, df (2, 27)',js['pf']['p'],stats.f.sf(4.2,2,27))
chk('p value calculator','χ² = 7.8, df 3',js['pchi']['p'],stats.chi2.sf(7.8,3))
tr=0.45*np.sqrt(28)/np.sqrt(1-0.45**2); chk('p value calculator','r = .45, n = 30',js['pr']['p'],2*stats.t.sf(tr,28))
lo,hi=stats.t.interval(0.95,24,loc=50,scale=10/5); chk('Confidence interval (mean)','lower',js['cimean']['low'],lo); chk('Confidence interval (mean)','upper',js['cimean']['high'],hi)
z=stats.norm.ppf(.975); p=45/120; n=120; cen=(p+z*z/(2*n))/(1+z*z/n); h=z*np.sqrt(p*(1-p)/n+z*z/(4*n*n))/(1+z*z/n)
chk('Confidence interval (proportion)','Wilson lower',js['ciprop']['wilsonLow'],cen-h); chk('Confidence interval (proportion)','Wilson upper',js['ciprop']['wilsonHigh'],cen+h)
chk('Margin of error','p = .5, n = 385, 95%',js['moe1']['margin'],z*np.sqrt(.25/385))
chk('Margin of error','n = 278 of N = 1,000 (FPC)',js['moe2']['margin'],z*np.sqrt(.25/278)*np.sqrt((1000-278)/999))
chk('Margin of error','mean, SD 12, n = 100, 99%',js['moe3']['margin'],stats.norm.ppf(.995)*12/10)
r=stats.fisher_exact([[8,2],[1,5]]); chk("Fisher's exact test",'p two-sided',js['fisher']['pTwoSided'],r.pvalue); chk("Fisher's exact test",'odds ratio',js['fisher']['oddsRatio'],r.statistic)
chk("Fisher's exact test",'p one-sided (greater)',js['fisher']['pGreater'],stats.fisher_exact([[8,2],[1,5]],alternative='greater').pvalue)
# Two-way ANOVA Type III, reference implementation via sum-coded design + model comparison using lstsq
tw=d['twoway']; A=[r[0] for r in tw]; B=[r[1] for r in tw]; Y=np.array([r[2] for r in tw],float)
la=sorted(set(A)); lb=sorted(set(B))
def sc(levels,v): return [1 if v==l else (-1 if v==levels[-1] else 0) for l in levels[:-1]]
Ac=np.array([sc(la,v) for v in A]); Bc=np.array([sc(lb,v) for v in B]); ABc=np.column_stack([Ac[:,i]*Bc[:,j] for i in range(Ac.shape[1]) for j in range(Bc.shape[1])])
def SSE(*cols):
    M=np.column_stack([np.ones(len(Y))]+list(cols)); bb=np.linalg.lstsq(M,Y,rcond=None)[0]; return ((Y-M@bb)**2).sum()
full=SSE(Ac,Bc,ABc); dfe=len(Y)-len(la)*len(lb)
for i,(nm,cols,df) in enumerate([('A',(Bc,ABc),1),('B',(Ac,ABc),2),('A × B',(Ac,Bc),2)]):
    ss=SSE(*cols)-full; F=(ss/df)/(full/dfe)
    chk('Two-way ANOVA (Type III)',f'F ({nm})',js['twoway']['terms'][i]['f'],F); chk('Two-way ANOVA (Type III)',f'p ({nm})',js['twoway']['terms'][i]['p'],stats.f.sf(F,df,dfe))
# RM ANOVA reference via long-format decomposition and eigenvalue-based GG epsilon
n,kk=rm.shape; gm=rm.mean(); ssc=n*((rm.mean(0)-gm)**2).sum(); sss=kk*((rm.mean(1)-gm)**2).sum(); sst=((rm-gm)**2).sum(); sse=sst-ssc-sss
F=(ssc/(kk-1))/(sse/((kk-1)*(n-1))); chk('Repeated-measures ANOVA','F',js['rm']['f'],F); chk('Repeated-measures ANOVA','p',js['rm']['p'],stats.f.sf(F,kk-1,(kk-1)*(n-1)))
S=np.cov(rm.T); Cm=np.eye(kk)-1/kk; dS=Cm@S@Cm; ev=np.linalg.eigvalsh(dS); ev=ev[ev>1e-12]
gg=ev.sum()**2/((kk-1)*(ev**2).sum()); chk('Repeated-measures ANOVA','Greenhouse-Geisser ε',js['rm']['ggEpsilon'],gg)
chk('Repeated-measures ANOVA','p (GG-corrected)',js['rm']['pGG'],stats.f.sf(F,(kk-1)*gg,(kk-1)*(n-1)*gg))
# Logistic regression via direct likelihood maximisation
Xl=np.column_stack([np.ones(20),d['logit_x'],d['logit_x2']]); yl=np.array(d['logit_y'])
nll=lambda b: -(yl*(Xl@b)-np.logaddexp(0,Xl@b)).sum()
bh=optimize.minimize(nll,np.zeros(3),method='BFGS',options={'gtol':1e-10}).x
mu=1/(1+np.exp(-Xl@bh)); cov=np.linalg.inv(Xl.T@(Xl*(mu*(1-mu))[:,None])); se=np.sqrt(np.diag(cov))
for j,nm in [(1,'b (x)'),(2,'b (x2)')]:
    chk('Logistic regression',nm,js['logit']['coefficients'][j]['b'],bh[j]); 
chk('Logistic regression','SE (x)',js['logit']['coefficients'][1]['se'],se[1]); chk('Logistic regression','p (x)',js['logit']['coefficients'][1]['p'],2*stats.norm.sf(abs(bh[1]/se[1])))
ll0=yl.sum()*np.log(yl.mean())+(20-yl.sum())*np.log(1-yl.mean()); chi=2*(-nll(bh)-ll0)
chk('Logistic regression','model χ²',js['logit']['modelChi'],chi)
Xo=np.array(d['omega_items']); Ro=np.corrcoef(Xo.T)
def uls(l):
    res=Ro-np.outer(l,l); np.fill_diagonal(res,0); return (res**2).sum()
lo=np.abs(optimize.minimize(uls,np.full(Xo.shape[1],.5),method='BFGS',options={'gtol':1e-12}).x)
chk("McDonald's omega",'ω total (one factor, minres)',js['omega']['omega'],lo.sum()**2/(lo.sum()**2+(1-lo**2).sum()))

# Kendall's W (tie-corrected), independent formula
from scipy.stats import rankdata
M=np.array(d['kw_raters'],float); m,nobj=M.shape; Rk=np.array([rankdata(r) for r in M]); Rs=Rk.sum(0); S=((Rs-Rs.mean())**2).sum()
T=sum(((np.unique(r,return_counts=True)[1]**3)-np.unique(r,return_counts=True)[1]).sum() for r in M)
Wref=12*S/(m*m*(nobj**3-nobj)-m*T); chk("Kendall's W",'W (tie-corrected)',js['kendallW']['w'],Wref)
chk("Kendall's W",'p',js['kendallW']['p'],stats.chi2.sf(m*(nobj-1)*Wref,nobj-1))
# Fleiss' kappa: published example (Fleiss 1971 data as used in the Wikipedia worked example) and generic formula
C=np.array(d['fleiss'],float); N,k=C.shape; nr=C[0].sum(); pj=C.sum(0)/(N*nr); Pi=((C**2).sum(1)-nr)/(nr*(nr-1)); kap=(Pi.mean()-(pj**2).sum())/(1-(pj**2).sum())
chk("Fleiss' kappa",'κ',js['fleiss']['kappa'],kap)
chk("Fleiss' kappa",'κ (published 14-rater example, 0.210)',js['fleiss_pub']['kappa'],0.2099,2e-3)
# ANCOVA with treatment coding (independent of the sum coding used in SolveGrid)
A=d['ancova']; grp=np.array([r[0] for r in A]); xa=np.array([r[1] for r in A]); ya=np.array([r[2] for r in A]); lv=sorted(set(grp))
D=np.column_stack([(grp==l).astype(float) for l in lv[1:]])
def sse(M):
    M=np.column_stack([np.ones(len(ya)),M]); b=np.linalg.lstsq(M,ya,rcond=None)[0]; return ((ya-M@b)**2).sum(),b
s_full,bf=sse(np.column_stack([D,xa])); s_nog,_=sse(xa[:,None]); s_nox,_=sse(D)
dfe=len(ya)-len(lv)-1; Fg=((s_nog-s_full)/(len(lv)-1))/(s_full/dfe); Fx=(s_nox-s_full)/(s_full/dfe)
chk('ANCOVA','F (group, adjusted)',js['ancova']['terms'][1]['f'],Fg); chk('ANCOVA','p (group)',js['ancova']['terms'][1]['p'],stats.f.sf(Fg,len(lv)-1,dfe)); chk('ANCOVA','F (covariate)',js['ancova']['terms'][0]['f'],Fx)
for i,l in enumerate(lv):
    adj=bf[0]+(bf[i] if i>0 else 0)+bf[-1]*xa.mean(); chk('ANCOVA',f'adjusted mean ({l})',js['ancova']['groups'][[g['name'] for g in js['ancova']['groups']].index(l)]['adjustedMean'],adj)
# MANOVA via numpy eigenvalues of E^-1 H
Mv=d['manova']; gm=np.array([r[0] for r in Mv]); Ym=np.array([r[1:] for r in Mv],float); lv=sorted(set(gm)); pp=Ym.shape[1]; q=len(lv)-1; dfe=len(Ym)-len(lv)
mu=Ym.mean(0); H=sum((gm==l).sum()*np.outer(Ym[gm==l].mean(0)-mu,Ym[gm==l].mean(0)-mu) for l in lv); E=sum(((Ym[gm==l]-Ym[gm==l].mean(0)).T@(Ym[gm==l]-Ym[gm==l].mean(0))) for l in lv)
ev=np.sort(np.real(np.linalg.eigvals(np.linalg.solve(E,H))))[::-1][:min(pp,q)]
pil=(ev/(1+ev)).sum(); wil=np.prod(1/(1+ev)); hot=ev.sum(); roy=ev[0]
chk('One-way MANOVA',"Pillai's trace",js['manova']['stats'][0]['value'],pil); chk('One-way MANOVA',"Wilks' lambda",js['manova']['stats'][1]['value'],wil)
chk('One-way MANOVA',"Hotelling's trace",js['manova']['stats'][2]['value'],hot); chk('One-way MANOVA',"Roy's largest root",js['manova']['stats'][3]['value'],roy)
s_=min(pp,q); m_=(abs(pp-q)-1)/2; n_=(dfe-pp-1)/2; Fp=(2*n_+s_+1)/(2*m_+s_+1)*pil/(s_-pil)
chk('One-way MANOVA',"Pillai F",js['manova']['stats'][0]['f'],Fp); chk('One-way MANOVA',"Pillai p",js['manova']['stats'][0]['p'],stats.f.sf(Fp,s_*(2*m_+s_+1),s_*(2*n_+s_+1)))
# EFA: KMO, Bartlett, PAF communalities via ULS optimisation (rotation invariant), varimax via SVD algorithm
Xe=np.array(d['efa']); Re=np.corrcoef(Xe.T); Ri=np.linalg.inv(Re); Pm=-Ri/np.sqrt(np.outer(np.diag(Ri),np.diag(Ri))); off=~np.eye(9,dtype=bool)
kmo=(Re[off]**2).sum()/((Re[off]**2).sum()+(Pm[off]**2).sum()); chk('Factor analysis (EFA)','KMO',js['efa']['kmo'],kmo)
bc=-(len(Xe)-1-(2*9+5)/6)*np.log(np.linalg.det(Re)); chk('Factor analysis (EFA)',"Bartlett's χ²",js['efa']['bartlettChi'],bc)
def ulsk(v):
    Lm=v.reshape(9,3); res=Re-Lm@Lm.T; np.fill_diagonal(res,0); return (res**2).sum()
Lr=optimize.minimize(ulsk,np.full(27,.3)+np.random.default_rng(1).normal(0,.05,27),method='BFGS',options={'gtol':1e-12,'maxiter':20000}).x.reshape(9,3)
hc=(Lr**2).sum(1)
for i in (0,4,8): chk('Factor analysis (EFA)',f'communality (item {i+1})',js['efa']['communalities'][i],hc[i],2e-3)
def varimax_ref(Phi,gamma=1,q=500,tol=1e-12):
    h=np.sqrt((Phi**2).sum(1)); A=Phi/h[:,None]; p_,k_=A.shape; Rm=np.eye(k_); dd=0
    for _ in range(q):
        L_=A@Rm; u,s,vh=np.linalg.svd(A.T@(L_**3-(gamma/p_)*L_@np.diag((L_**2).sum(0)))); Rm=u@vh; d_old=dd; dd=s.sum()
        if d_old and dd/d_old<1+tol: break
    return (A@Rm)*h[:,None]
Vr=varimax_ref(Lr); Jl=np.array(js['efa']['loadings'])
for f in range(3):
    j=int(np.argmax([abs(np.corrcoef(Jl[:,f],Vr[:,c])[0,1]) for c in range(3)]))
    chk('Factor analysis (EFA)',f'varimax loading max |λ| (factor {f+1})',np.abs(Jl[:,f]).max(),np.abs(Vr[:,j]).max(),2e-3)

json.dump(rows,open('validation.json','w'),ensure_ascii=False,indent=1)
bad=[r for r in rows if not r['ok']]
print(len(rows),'checks;',len(bad),'mismatches')
for r in bad: print(r)
